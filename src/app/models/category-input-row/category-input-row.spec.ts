import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryInputRow } from './category-input-row';

describe('CategoryInputRow', () => {
  let component: CategoryInputRow;
  let fixture: ComponentFixture<CategoryInputRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryInputRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryInputRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
