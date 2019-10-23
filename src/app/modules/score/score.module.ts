import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { DispositionModule } from '@app/modules/disposition/disposition.module';
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
