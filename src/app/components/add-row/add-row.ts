
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-row',
  standalone: true,
  templateUrl: './add-row.html',
  styleUrl: './add-row.css',
})
export class AddRow {
  @Input({ required: true }) categoryTitle = '';
  @Input({ required: true }) colSpan = 1;
  @Output() add = new EventEmitter<string>();

  handleAdd(input: HTMLInputElement) {
    if (input.value.trim()) {
      this.add.emit(input.value);
      input.value = '';
    }
  }
}
