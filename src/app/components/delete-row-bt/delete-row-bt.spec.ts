import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRowBt } from './delete-row-bt';

describe('DeleteRowBt', () => {
  let component: DeleteRowBt;
  let fixture: ComponentFixture<DeleteRowBt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRowBt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRowBt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
