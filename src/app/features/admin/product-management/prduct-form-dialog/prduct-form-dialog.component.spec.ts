import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrductFormDialogComponent } from './prduct-form-dialog.component';

describe('PrductFormDialogComponent', () => {
  let component: PrductFormDialogComponent;
  let fixture: ComponentFixture<PrductFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrductFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrductFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
