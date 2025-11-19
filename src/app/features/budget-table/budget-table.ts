
import { Component, inject, signal, HostListener, ElementRef, ViewChildren, QueryList, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetStateService } from "../../core/budget-state.service/budget-state.service"
import { ContextMenuComponent } from '../../components/context-menu/context-menu';
import * as Constants from "../../components/utilities/Constants";
import {DeleteRowBtnComponent} from "../../components/delete-row-bt/delete-row-bt"

@Component({
  selector: 'app-budget-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    ContextMenuComponent,
    DeleteRowBtnComponent,
  ],
  templateUrl: './budget-table.html',
  styleUrl: './budget-table.css',

})
export class BudgetTable implements AfterViewInit {
  service = inject(BudgetStateService);
  platformId = inject(PLATFORM_ID);

  menu = signal({ visible: false, x: 0, y: 0, rowId: '', monthKey: '' });

  private userHasInteracted = false;

  @ViewChildren('cellInput') inputs!: QueryList<ElementRef>;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.inputs.changes.subscribe(() => {
      this.ensureFocus();
    });
    this.ensureFocus();
  }

  private ensureFocus() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.userHasInteracted || this.inputs.length === 0) return;
    setTimeout(() => {
      const newActiveElement = document.activeElement;
      const isFocusLost = !newActiveElement || newActiveElement.tagName === Constants.BODY;
      if (isFocusLost && this.inputs.first) {
        this.inputs.first.nativeElement.focus();
      }
    });
  }

  @HostListener('document:click')
  @HostListener('document:keydown')
  onUserInteraction() {
    this.userHasInteracted = true;
  }

  deleteRow(rowId: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (confirm(Constants.DELETE_MSG)) {
        this.service.deleteRow(rowId);
      }
    }
  }

  onKeyNavigation(event: KeyboardEvent, rowId: string, colIndex: number) {
    this.userHasInteracted = true;
    if (!Constants.KEYWORDS_ARROW.includes(event.key)) return;
    event.preventDefault();
    const allInputs = this.inputs.toArray();
    const currentIndex = allInputs.findIndex(el => el.nativeElement === event.target);
    if (currentIndex === -1) return;
    const columns = this.service.months().length + 1;
    let nextIndex = currentIndex;

    switch (event.key) {
      case Constants.ARROW_RIGHT: nextIndex = currentIndex + 1; break;
      case Constants.ARROW_LEFT: nextIndex = currentIndex - 1; break;
      case Constants.ARROW_DOWN: nextIndex = currentIndex + columns - 1; break;
      case Constants.ARROW_UP: nextIndex = currentIndex - columns + 1; break;
    }

    if (nextIndex >= 0 && nextIndex < allInputs.length) {
      allInputs[nextIndex].nativeElement.focus();
      allInputs[nextIndex].nativeElement.select();
    }
  }

  onContextMenu(event: MouseEvent, rowId: string, monthKey: string) {
    event.preventDefault();
    this.menu.set({ visible: true, x: event.clientX, y: event.clientY, rowId, monthKey });
  }

  applyToAll() {
    const { rowId, monthKey } = this.menu();
    this.service.applyToAll(rowId, monthKey);
    this.closeMenu();
  }

  @HostListener('document:click')
  closeMenu() {
    if (this.menu().visible) this.menu.update(men => ({ ...men, visible: false }));
  }
}

