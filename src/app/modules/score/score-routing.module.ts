import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterOutletComponent } from '@app/shared/components/router-outlet/router-outlet.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { ScoreDetailComponent } from './pages/score-detail/score-detail.component';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'score-outlet' },
    children: [
      { path: '', component: RankingComponent, data: { state: 'ranking' } },
      { path: ':id', component: ScoreDetailComponent, data: { state: 'details' } },
      { path: 'last', component: ScoreDetailComponent, data: { state: 'last' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoreRoutingModule { }
