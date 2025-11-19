
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetStateService } from "../../core/budget-state.service/budget-state.service"

@Component({
  selector: 'app-month-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './month-selector.html'
})
export class MonthSelectorComponent {
  service = inject(BudgetStateService);// Injection BudgetStateService
  startDateStr = computed(() => this.service.startDate().toISOString().slice(0, 7)); // to read the start date
  endDateStr = computed(() => this.service.endDate().toISOString().slice(0, 7)); // to read the end date
  // update dates
  updateStartDate(value: string) { if (value) this.service.startDate.set(new Date(value + '-01')); }
  updateEndDate(value: string) { if (value) this.service.endDate.set(new Date(value + '-01')); }
}
