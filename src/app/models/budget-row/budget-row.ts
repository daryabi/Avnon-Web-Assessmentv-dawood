import { WritableSignal } from '@angular/core';
import { MonthKey } from "../month/month"

export interface BudgetRow {
  id: string;
  name: WritableSignal<string>;
  values: Map<MonthKey, WritableSignal<number>>;
}