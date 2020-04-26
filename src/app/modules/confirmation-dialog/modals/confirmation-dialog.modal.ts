import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'fm-confirmation-dialog',
  templateUrl: './confirmation-dialog.modal.html',
  styleUrls: ['./confirmation-dialog.modal.scss']
})
export class ConfirmationDialogModal implements OnInit {
  text = 'Sei sicuro?';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { text?: string }) { }

  ngOnInit(): void {
    if (this.data.text) {
      this.text = this.data.text;
    }
  }

}
