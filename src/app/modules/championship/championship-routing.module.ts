import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '@app/guards';

import { ChampionshipStreamPage } from './pages/championship-stream/championship-stream.page';
import { ChampionshipResolver } from './pages/championship/championship-resolve.service';
import { ChampionshipPage } from './pages/championship/championship.page';

const routes: Routes = [
  {
    path: ':championship_id',
    component: ChampionshipPage,
    data: {
      // eslint-disable-next-line no-template-curly-in-string
      breadcrumbs: '${championship.league.name}',
      state: 'championship',
    },
    resolve: {
      championship: ChampionshipResolver,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'teams',
      },
      {
        path: 'articles',
        data: { state: 'articles' },
        loadChildren: async () => import('@modules/article/article.module')
          .then(m => m.ArticleModule),
      },
      {
        path: 'teams',
        data: { state: 'teams' },
        loadChildren: async () => import('@modules/team/team.module')
          .then(m => m.TeamModule),
      },
      {
        path: 'members',
        data: { state: 'members' },
        loadChildren: async () => import('@modules/member/member.module')
          .then(m => m.MemberModule),
      },
      {
        path: 'ranking',
        data: { state: 'ranking' },
        loadChildren: async () => import('@modules/score/score.module')
          .then(m => m.ScoreModule),
      },
      {
        path: 'stream',
        component: ChampionshipStreamPage,
        data: { state: 'stream' },
      },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        data: { state: 'championship-admin' },
        loadChildren: async () => import('@modules/admin-championship/admin-championship.module')
          .then(m => m.AdminChampionshipModule),
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class ChampionshipRoutingModule {
  public static components = [
    ChampionshipPage,
    ChampionshipStreamPage,
  ];
}
