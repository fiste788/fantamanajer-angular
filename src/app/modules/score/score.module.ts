import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DispositionModule } from '@modules/disposition/disposition.module';
import { SharedModule } from '@shared/shared.module';

import { ScoreRoutingModule } from './score-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ScoreRoutingModule,
    DispositionModule
  ],
  declarations: [
    ScoreRoutingModule.components
  ]
})
export class ScoreModule { }
