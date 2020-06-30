import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  styleUrls: ['./confirmation-dialog.modal.scss'],
  templateUrl: './confirmation-dialog.modal.html',
})
export class ConfirmationDialogModal implements OnInit {
  public text = 'Sei sicuro?';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { text?: string }) { }

  public ngOnInit(): void {
    if (this.data.text) {
      this.text = this.data.text;
    }
  }

}
