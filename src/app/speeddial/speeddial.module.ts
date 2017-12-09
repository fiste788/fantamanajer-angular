import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SmdFabSpeedDialTrigger,
    SmdFabSpeedDialActions,
    SmdFabSpeedDialComponent} from './smd-fab-speed-dial';

const COMPONENTS = [
  SmdFabSpeedDialTrigger,
  SmdFabSpeedDialActions,
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
