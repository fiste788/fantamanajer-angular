import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { McBreadcrumbsModule } from 'ngx-breadcrumbs-ui';

import { AuthGuard } from '@app/guards';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module')
      .then(m => m.HomeModule),
    data: { state: 'home' }
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module')
      .then(m => m.AuthModule),
    data: { state: 'auth' }
  },
  {
    path: 'clubs',
    loadChildren: () => import('./modules/club/club.module')
      .then(m => m.ClubModule),
    data: { state: 'club' }
  },
  {
    path: 'players',
    loadChildren: () => import('./modules/player/player.module')
      .then(m => m.PlayerModule),
    data: { state: 'player' }
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module')
      .then(m => m.UserModule),
    canActivate: [AuthGuard],
    data: { state: 'user' }
  },
  {
    path: 'championships',
    loadChildren: () => import('./modules/championship/championship.module')
      .then(m => m.ChampionshipModule),
    canActivate: [AuthGuard],
    data: { state: 'championship' }
  },
  {
    path: 'teams',
    loadChildren: () => import('./modules/team/team.module')
      .then(m => m.TeamModule),
    canActivate: [AuthGuard],
    data: { state: 'team' }
  },
  {
    path: 'articles',
    loadChildren: () => import('./modules/article/article.module')
      .then(m => m.ArticleModule),
    canActivate: [AuthGuard],
    data: { state: 'article' }
  },
  {
    path: 'scores',
    loadChildren: () => import('./modules/score/score.module')
      .then(m => m.ScoreModule),
    canActivate: [AuthGuard],
    data: { state: 'scores' }
  },
  {
    path: 'lineups',
    loadChildren: () => import('./modules/lineup/lineup.module')
      .then(m => m.LineupModule),
    canActivate: [AuthGuard],
    data: { state: 'lineup' }
  },
  {
    path: 'transferts',
    loadChildren: () => import('./modules/transfert/transfert.module')
      .then(m => m.TransfertModule),
    canActivate: [AuthGuard],
    data: { state: 'transfert' }
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload'
    }),
    McBreadcrumbsModule.forRoot()
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
