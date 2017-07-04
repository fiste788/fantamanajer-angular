import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ScoreService } from './score.service';
import { RankingComponent } from './ranking/ranking.component';
import { ScoreComponent } from './score.component';
import { ScoreRoutingModule } from './score-routing.module';
import { ScoreDetailComponent } from './score-detail/score-detail.component';

@NgModule({
  imports: [
    SharedModule,
    ScoreRoutingModule
  ],
  declarations: [RankingComponent, ScoreComponent, ScoreDetailComponent],
  providers: [ScoreService]
})
export class ScoreModule { }
