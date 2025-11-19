import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.html'
})
export class ContextMenuComponent {
  @Input({ required: true }) x = 0;
  @Input({ required: true }) y = 0;
  @Output() action = new EventEmitter<void>();
}
