import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreComponent } from './score/score.component';
import { RankingComponent } from './ranking/ranking.component';
import { ScoreDetailComponent } from './score-detail/score-detail.component';

const routes: Routes = [
  { path: '',
    component: ScoreComponent,
    children: [
      { path: '', component: RankingComponent },
      { path: ':id', component: ScoreDetailComponent },
      { path: 'last', component: ScoreDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoreRoutingModule {}
