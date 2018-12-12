import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@app/core/guards';
import { ChampionshipComponent } from './pages/championship/championship.component';
import { ChampionshipResolver } from './pages/championship/championship-resolve.service';
import { ChampionshipStreamComponent } from './pages/championship-stream/championship-stream.component';

const routes: Routes = [
  {
    path: ':championship_id',
    component: ChampionshipComponent,
    data: {
      state: 'championship',
      breadcrumbs: '{{ championship.league.name }}',
    },
    resolve: {
      championship: ChampionshipResolver
    },
    children: [
      { path: '', redirectTo: 'teams', pathMatch: 'full' },
      { path: 'articles', loadChildren: 'app/modules/article/article.module#ArticleModule', data: { state: 'articles' } },
      { path: 'teams', loadChildren: 'app/modules/team/team.module#TeamModule', data: { state: 'teams' } },
      { path: 'members', loadChildren: 'app/modules/member/member.module#MemberModule', data: { state: 'members' } },
      { path: 'ranking', loadChildren: 'app/modules/score/score.module#ScoreModule', data: { state: 'ranking' } },
      { path: 'stream', component: ChampionshipStreamComponent, data: { state: 'stream' } },
      {
        path: 'admin',
        loadChildren: 'app/admin/championship/championship.module#ChampionshipModule',
        canActivate: [AdminGuard],
        data: { state: 'championship-admin' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChampionshipRoutingModule { }
