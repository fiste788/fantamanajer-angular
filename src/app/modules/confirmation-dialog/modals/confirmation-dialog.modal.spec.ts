import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmationDialogModal } from './confirmation-dialog.modal';

describe('ConfirmationDialogModal', () => {
  let component: ConfirmationDialogModal;
  let fixture: ComponentFixture<ConfirmationDialogModal>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [ConfirmationDialogModal],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
