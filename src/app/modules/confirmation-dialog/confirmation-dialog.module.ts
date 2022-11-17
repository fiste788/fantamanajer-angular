import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedModule } from '@shared/shared.module';

import { ConfirmationDialogModal } from './modals/confirmation-dialog.modal';

@NgModule({
  declarations: [ConfirmationDialogModal],
  imports: [SharedModule, MatDialogModule],
})
export class ConfirmationDialogModule {}
