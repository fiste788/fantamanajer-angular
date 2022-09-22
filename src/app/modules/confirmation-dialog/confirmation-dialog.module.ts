import { NgModule } from '@angular/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { SharedModule } from '@shared/shared.module';

import { ConfirmationDialogModal } from './modals/confirmation-dialog.modal';

@NgModule({
  declarations: [ConfirmationDialogModal],
  imports: [SharedModule, MatDialogModule],
})
export class ConfirmationDialogModule {}
