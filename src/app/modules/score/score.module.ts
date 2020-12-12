import { NgModule } from '@angular/core';

import { DispositionModule } from '@modules/disposition/disposition.module';
import { SharedModule } from '@shared/shared.module';

import { ScoreRoutingModule } from './score-routing.module';

@NgModule({
  declarations: [
    ScoreRoutingModule.components,
  ],
  imports: [
    SharedModule,
    ScoreRoutingModule,
    DispositionModule,
  ],
})
export class ScoreModule { }
