import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-confirmation-dialog',
  styleUrls: ['./confirmation-dialog.modal.scss'],
  templateUrl: './confirmation-dialog.modal.html',
})
export class ConfirmationDialogModal {
  protected text: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { text?: string }) {
    this.text = this.data.text ?? 'Sei sicuro?';
  }
}
