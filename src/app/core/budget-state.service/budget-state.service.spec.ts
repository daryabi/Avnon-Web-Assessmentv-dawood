import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetStateService } from './budget-state.service';

describe('BudgetStateService', () => {
  let component: BudgetStateService;
  let fixture: ComponentFixture<BudgetStateService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetStateService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetStateService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
