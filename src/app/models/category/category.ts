import { WritableSignal, Signal } from '@angular/core';
import { MonthKey } from "../month/month";
import { BudgetRow } from "../budget-row/budget-row";

export interface BudgetCategory {
  id: string;
  title: string;
  rows: WritableSignal<BudgetRow[]>;
  subTotal: Signal<Map<MonthKey, number>>;
}

export interface BudgetSection {
  id: string;
  title: string;
  categories: WritableSignal<BudgetCategory[]>;
  total: Signal<Map<MonthKey, number>>;
}
