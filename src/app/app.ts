import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthSelectorComponent } from "./components/month-selector/month-selector";
import { BudgetTable } from "./features/budget-table/budget-table"
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MonthSelectorComponent, BudgetTable],
  templateUrl: './app.html'
})
export class App { }