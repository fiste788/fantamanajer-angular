import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '@app/guards';

import { ChampionshipStreamComponent } from './pages/championship-stream/championship-stream.component';
import { ChampionshipResolver } from './pages/championship/championship-resolve.service';
import { ChampionshipComponent } from './pages/championship/championship.component';

const routes: Routes = [
  {
    path: ':championship_id',
    component: ChampionshipComponent,
    data: {
      state: 'championship',
      breadcrumbs: '{{ championship.league.name }}'
    },
    resolve: {
      championship: ChampionshipResolver
    },
    children: [
      {
        path: '',
        redirectTo: 'teams',
        pathMatch: 'full'
      },
      {
        path: 'articles',
        loadChildren: () => import('@modules/article/article.module')
          .then(m => m.ArticleModule),
        data: { state: 'articles' }
      },
      {
        path: 'teams',
        loadChildren: () => import('@modules/team/team.module')
          .then(m => m.TeamModule),
        data: { state: 'teams' }
      },
      {
        path: 'members',
        loadChildren: () => import('@modules/member/member.module')
          .then(m => m.MemberModule),
        data: { state: 'members' }
      },
      {
        path: 'ranking',
        loadChildren: () => import('@modules/score/score.module')
          .then(m => m.ScoreModule),
        data: { state: 'ranking' }
      },
      {
        path: 'stream',
        component: ChampionshipStreamComponent,
        data: { state: 'stream' }
      },
      {
        path: 'admin',
        loadChildren: () => import('@modules/admin-championship/admin-championship.module')
          .then(m => m.AdminChampionshipModule),
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
