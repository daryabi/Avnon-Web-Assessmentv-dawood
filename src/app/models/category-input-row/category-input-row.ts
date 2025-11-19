import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-category-input-row',
  standalone: true,
  templateUrl: './category-input-row.html',
  styleUrl: './category-input-row.css',
})
export class CategoryInputRow {
  @Input({ required: true }) categoryName = '';
  @Input({ required: true }) colSpan = 1;
  @Output() add = new EventEmitter<string>();

  onEnter(input: HTMLInputElement) {
    if (input.value.trim()) {
      this.add.emit(input.value);
      input.value = '';
    }
  }
}