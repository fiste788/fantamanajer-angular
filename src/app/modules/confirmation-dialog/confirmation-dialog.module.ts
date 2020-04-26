import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedModule } from '@shared/shared.module';

import { ConfirmationDialogModal } from './modals/confirmation-dialog.modal';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatDialogModule
  ],
  declarations: [
    ConfirmationDialogModal
  ]
})
export class ConfirmationDialogModule { }
