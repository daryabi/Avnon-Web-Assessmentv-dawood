import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRow } from './add-row';

describe('AddRow', () => {
  let component: AddRow;
  let fixture: ComponentFixture<AddRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
