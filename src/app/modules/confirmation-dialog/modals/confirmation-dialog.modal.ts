import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmation-dialog.modal.html',
})
export class ConfirmationDialogModal {
  public data = inject<{ text?: string }>(MAT_DIALOG_DATA);
  protected text = this.data.text ?? 'Sei sicuro?';
}
