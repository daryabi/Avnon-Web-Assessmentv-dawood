import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-row-btn',
  standalone: true,
  templateUrl:'./delete-row-bt.html'
})
export class DeleteRowBtnComponent {
  @Output() delete = new EventEmitter<void>();
}