import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChampionshipComponent } from './championship/championship.component';
/*import { ArticleListComponent }   from '../article/article-list.component';
import { ArticleDetailComponent }   from '../article/article-detail.component';*/

const routes: Routes = [
  {
    path: ':championship_id',
    component: ChampionshipComponent,
    children: [
    { path: '', redirectTo: 'teams', pathMatch: 'full' },
    { path: 'articles', loadChildren: 'app/article/article.module#ArticleModule'},
    { path: 'teams', loadChildren: 'app/team/team.module#TeamModule'},
    { path: 'members', loadChildren: 'app/member/member-lazy.module#MemberLazyModule'},
    { path: 'ranking', loadChildren: 'app/score/score.module#ScoreModule'},
    { path: 'events', loadChildren: 'app/event/event.module#EventModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChampionshipRoutingModule {}
