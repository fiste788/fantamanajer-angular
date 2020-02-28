import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DispositionModule } from '@modules/disposition/disposition.module';
import { SharedModule } from '@shared/shared.module';
import { RankingComponent } from './pages/ranking/ranking.component';
import { ScoreDetailComponent } from './pages/score-detail/score-detail.component';
import { ScoreRoutingModule } from './score-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ScoreRoutingModule,
    DispositionModule
  ],
  declarations: [
    RankingComponent,
    ScoreDetailComponent
  ]
})
export class ScoreModule { }
