import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { ConfirmationDialogComponent } from './modals/confirmation-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatDialogModule
  ],
  declarations: [
    ConfirmationDialogComponent
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ]
})
export class ConfirmationDialogModule { }
