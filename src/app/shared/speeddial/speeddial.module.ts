import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared.module';
import {
  SmdFabSpeedDialTriggerComponent,
  SmdFabSpeedDialActionsComponent,
  SmdFabSpeedDialComponent
} from './smd-fab-speed-dial';

const COMPONENTS = [
  SmdFabSpeedDialTriggerComponent,
  SmdFabSpeedDialActionsComponent,
  SmdFabSpeedDialComponent
];
@NgModule({
  imports: [
    SharedModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SpeeddialModule { }
