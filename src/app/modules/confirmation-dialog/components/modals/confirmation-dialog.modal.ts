import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './confirmation-dialog.modal.html',
})
export class ConfirmationDialogModal {

  public data = inject<{ text?: string }>(MAT_DIALOG_DATA);

  protected text = this.data.text ?? 'Sei sicuro?';

}
