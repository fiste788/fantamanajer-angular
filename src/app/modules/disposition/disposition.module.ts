import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { DispositionListComponent } from './components/disposition-list/disposition-list.component';

@NgModule({
  declarations: [
    DispositionListComponent,
  ],
  exports: [
    DispositionListComponent,
  ],
  imports: [
    SharedModule,
  ],
})
export class DispositionModule { }
