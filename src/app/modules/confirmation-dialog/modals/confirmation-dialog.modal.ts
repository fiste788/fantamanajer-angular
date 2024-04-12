import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  styleUrl: './confirmation-dialog.modal.scss',
  templateUrl: './confirmation-dialog.modal.html',
})
export class ConfirmationDialogModal {
  protected text: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { text?: string }) {
    this.text = this.data.text ?? 'Sei sicuro?';
  }
}
