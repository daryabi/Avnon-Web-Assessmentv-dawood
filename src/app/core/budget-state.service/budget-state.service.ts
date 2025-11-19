import { Injectable, signal, computed, effect, WritableSignal } from '@angular/core';


import { Month, MonthKey } from "../../models/month/month";
import { BudgetSection, BudgetCategory } from "../../models/category/category";
import { BudgetRow } from "../../models/budget-row/budget-row";
import * as Constants from "../../components/utilities/Constants";

@Injectable({ providedIn: 'root' })
export class BudgetStateService {

  startDate = signal(new Date(2025, 0, 1));
  endDate = signal(new Date(2025, 11, 31));
  months = computed<Month[]>(() => {
    const resultingMonths: Month[] = [];
    let currentDate = new Date(this.startDate());
    const endDateTemp = this.endDate();
    let counter = 0;
    while (currentDate <= endDateTemp && counter < 60) {
      resultingMonths.push({
        key: currentDate.toISOString().slice(0, 7), // to  'YYYY-MM'
        label: currentDate.toLocaleString(Constants.DEFAULT, { month: Constants.SHORT, year: Constants.NUMERIC })
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
      counter++;
    }
    return resultingMonths;
  });

  income = this.createSection(Constants.INCOME_STR, Constants.INCOME_STR, [Constants.GENERAL_INCOME, Constants.OTHER_INCOME]);
  expenses = this.createSection(Constants.EXPENSES, Constants.EXPENSES, [Constants.OPERATIONAL_EXPENSES, Constants.SALARIES_WAGES]);

  profitAndLoss = computed(() => {
    const profitAndLossTemp = new Map<MonthKey, number>();
    const incomeTemp = this.income.total();
    const expensesTemp = this.expenses.total();


    for (const mont of this.months()) {
      profitAndLossTemp.set(mont.key, (incomeTemp.get(mont.key) || 0) - (expensesTemp.get(mont.key) || 0));
    }
    return profitAndLossTemp;
  });

  openingBalance = signal(new Map<MonthKey, number>());
  closingBalance = signal(new Map<MonthKey, number>());

  constructor() {
    effect(() => {
      const profitAndLossTemp = this.profitAndLoss();
      const months = this.months();
      const newOpeningBalances = new Map<MonthKey, number>();
      const newClosingBalances = new Map<MonthKey, number>();

      let previousClose = 0;

      months.forEach(index => {
        newOpeningBalances.set(index.key, previousClose);
        const currentClose = previousClose + (profitAndLossTemp.get(index.key) || 0);
        newClosingBalances.set(index.key, currentClose);
        previousClose = currentClose;
      });
      this.openingBalance.set(newOpeningBalances);
      this.closingBalance.set(newClosingBalances);
    }, { allowSignalWrites: true });
  }

  addRow(categoryId: string, name: string) {
    if (!name.trim()) return;
    const newRow = this.createRow(name);
    const findAndAddToCategory = (section: BudgetSection) => {
      const category = section.categories().find(cat => cat.id === categoryId);

      if (category) {
        category.rows.update(currentRows => [...currentRows, newRow]);
      }
    };
    findAndAddToCategory(this.income);
    findAndAddToCategory(this.expenses);
  }
  addCategory(sectionId: string, title: string) {

    if (!title.trim()) return;

    const newCategory = this.createCategory(title);
    if (sectionId === Constants.INCOME_STR) {
      this.income.categories.update(currentList => [...currentList, newCategory]);
    } else {
      this.expenses.categories.update(currentList =>
        [...currentList, newCategory]
      );
    }
  }

  deleteRow(rowId: string) {
    const removeRowFromSection = (section: BudgetSection) => {
      section.categories().forEach(category => {
        const isRowFound = category.rows().some(row => row.id === rowId);

        if (isRowFound) {
          // if row found exlcude 
          category.rows.update(currentRows =>
            currentRows.filter(row => row.id !== rowId)
          );
        }
      });
    };
    removeRowFromSection(this.income);
    removeRowFromSection(this.expenses);
  }


  applyToAll(rowId: string, sourceMonthKey: MonthKey) {
    const locateTargetRow = (section: BudgetSection) => {
      for (const category of section.categories()) {
        const targetRow = category.rows().find(r => r.id === rowId);
        if (targetRow) return targetRow;
      }
      return null;
    };

    const targetRow = locateTargetRow(this.income) || locateTargetRow(this.expenses);
    if (!targetRow) return;
    const sourceValue = targetRow.values.get(sourceMonthKey)?.() ?? 0;
    for (const month of this.months()) {
      targetRow.values.get(month.key)?.set(sourceValue);
    }
  }


  private createRow(name: string): BudgetRow {
    const monthlyValueSignals = new Map<MonthKey, WritableSignal<number>>();
    const referenceDate = new Date(2024, 0, 1);
    const totalMonthsToInitialize = 48;

    for (let i = 0; i < totalMonthsToInitialize; i++) {
      const key = referenceDate.toISOString().slice(0, 7);
      monthlyValueSignals.set(key, signal(0));// month =0
      referenceDate.setMonth(referenceDate.getMonth() + 1);//month + 
    }

    // based on the https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
    // using crypto.randomUUID() is new and modern way generate unique IDs in JavaScript
    return {
      // id: Date.now().toString() + Math.random().toString().slice(2, 6), 
      id: crypto.randomUUID(),
      name: signal(name),
      values: monthlyValueSignals
    };
  }

  private createCategory(title: string): BudgetCategory {
    const rows = signal([this.createRow(Constants.SAMPLE_ITEM)]);
    const subtotalTemp = computed(() => {
      const monthlyTotals = new Map<MonthKey, number>();
      for (const month of this.months()) {
        const monthlyTotal = rows().reduce((sum, row) => {
          const cellValue = row.values.get(month.key)?.() ?? 0;
          return sum + cellValue;
        }, 0);
        monthlyTotals.set(month.key, monthlyTotal);
      }
      return monthlyTotals;
    });
    return {
      // id: Date.now().toString() + Math.random().toString().slice(2, 6),
      id: crypto.randomUUID(),
      title: title,
      rows: rows,
      subTotal: subtotalTemp
    };
  }

  private createSection(id: string, title: string, categoryNames: string[]): BudgetSection {
    const categories = categoryNames.map(name => this.createCategory(name));
    const categoriesTemp = signal(categories);
    const totalTemp = computed(() => {
      const monthlyGrandTotals = new Map<MonthKey, number>();
      for (const month of this.months()) {

        const sectionTotal = categoriesTemp().reduce((currentSum, category) => {

          const categoryMonthlyTotal = category.subTotal().get(month.key) ?? 0;

          return currentSum + categoryMonthlyTotal;
        }, 0);

        monthlyGrandTotals.set(month.key, sectionTotal);
      }

      return monthlyGrandTotals;
    });
    return {
      id,
      title,
      categories: categoriesTemp,
      total: totalTemp
    };
  }
}
