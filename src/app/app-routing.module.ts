/* eslint-disable @typescript-eslint/promise-function-async */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  {
    path: 'home',
    data: { state: 'home' },
    loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'auth',
    data: { state: 'auth' },
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'clubs',
    data: { state: 'clubs' },
    loadChildren: () => import('./modules/club/club.module').then((m) => m.ClubModule),
  },
  {
    path: 'players',
    data: { state: 'players' },
    loadChildren: () => import('./modules/player/player.module').then((m) => m.PlayerModule),
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    data: { state: 'user' },
    loadChildren: () => import('./modules/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'championships',
    canActivate: [AuthGuard],
    data: { state: 'championships' },
    loadChildren: () =>
      import('./modules/championship/championship.module').then((m) => m.ChampionshipModule),
  },
  {
    path: 'teams',
    canActivate: [AuthGuard],
    data: { state: 'teams' },
    loadChildren: () => import('./modules/team/team.module').then((m) => m.TeamModule),
  },
  {
    path: 'articles',
    canActivate: [AuthGuard],
    data: { state: 'articles' },
    loadChildren: () => import('./modules/article/article.module').then((m) => m.ArticleModule),
  },
  {
    path: 'scores',
    canActivate: [AuthGuard],
    data: { state: 'scores' },
    loadChildren: () => import('./modules/score/score.module').then((m) => m.ScoreModule),
  },
  {
    path: 'lineups',
    canActivate: [AuthGuard],
    data: { state: 'lineups' },
    loadChildren: () => import('./modules/lineup/lineup.module').then((m) => m.LineupModule),
  },
  {
    path: 'transferts',
    canActivate: [AuthGuard],
    data: { state: 'transferts' },
    loadChildren: () =>
      import('./modules/transfert/transfert.module').then((m) => m.TransfertModule),
  },
];
@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      relativeLinkResolution: 'legacy',
    }),
  ],
})
export class AppRoutingModule {}
