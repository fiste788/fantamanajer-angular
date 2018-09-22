import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
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
