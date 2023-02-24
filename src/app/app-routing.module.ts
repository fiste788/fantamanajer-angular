/* eslint-disable @typescript-eslint/promise-function-async */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authenticatedGuard } from '@app/guards';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  {
    path: 'home',
    data: { state: 'home' },
    loadChildren: () => import('./modules/home/home.module'),
  },
  {
    path: 'auth',
    data: { state: 'auth' },
    loadChildren: () => import('./modules/auth/auth.module'),
  },
  {
    path: 'clubs',
    data: { state: 'clubs' },
    loadChildren: () => import('./modules/club/club.module'),
  },
  {
    path: 'players',
    data: { state: 'players' },
    loadChildren: () => import('./modules/player/player.module'),
  },
  {
    path: 'user',
    canActivate: [authenticatedGuard],
    data: { state: 'user' },
    loadChildren: () => import('./modules/user/user.module'),
  },
  {
    path: 'championships',
    canActivate: [authenticatedGuard],
    data: { state: 'championships' },
    loadChildren: () => import('./modules/championship/championship.module'),
  },
  {
    path: 'teams',
    canActivate: [authenticatedGuard],
    data: { state: 'teams' },
    loadChildren: () => import('./modules/team/team.module'),
  },
  {
    path: 'articles',
    canActivate: [authenticatedGuard],
    data: { state: 'articles' },
    loadChildren: () => import('./modules/article/article.module'),
  },
  {
    path: 'scores',
    canActivate: [authenticatedGuard],
    data: { state: 'scores' },
    loadChildren: () => import('./modules/score/score.module'),
  },
  {
    path: 'lineups',
    canActivate: [authenticatedGuard],
    data: { state: 'lineups' },
    loadChildren: () => import('./modules/lineup/lineup.module'),
  },
  {
    path: 'transferts',
    canActivate: [authenticatedGuard],
    data: { state: 'transferts' },
    loadChildren: () => import('./modules/transfert/transfert.module'),
  },
];
@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
  ],
})
export class AppRoutingModule {}
