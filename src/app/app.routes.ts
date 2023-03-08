/* eslint-disable @typescript-eslint/promise-function-async */

import { Routes } from '@angular/router';

import { authenticatedGuard } from '@app/guards';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  {
    path: 'home',
    data: { state: 'home' },
    loadChildren: () => import('./modules/home/home.routes'),
  },
  {
    path: 'auth',
    data: { state: 'auth' },
    loadChildren: () => import('./modules/auth/auth.routes'),
  },
  {
    path: 'clubs',
    data: { state: 'clubs' },
    loadChildren: () => import('./modules/club/club.routes'),
  },
  {
    path: 'players',
    data: { state: 'players' },
    loadChildren: () => import('./modules/player/player.routes'),
  },
  {
    path: 'user',
    canActivate: [authenticatedGuard],
    data: { state: 'user' },
    loadChildren: () => import('./modules/user/user.routes'),
  },
  {
    path: 'championships',
    canActivate: [authenticatedGuard],
    data: { state: 'championships' },
    loadChildren: () => import('./modules/championship/championship.routes'),
  },
  {
    path: 'teams',
    canActivate: [authenticatedGuard],
    data: { state: 'teams' },
    loadChildren: () => import('./modules/team/team.routes'),
  },
  {
    path: 'articles',
    canActivate: [authenticatedGuard],
    data: { state: 'articles' },
    loadChildren: () => import('./modules/article/article.routes'),
  },
  {
    path: 'scores',
    canActivate: [authenticatedGuard],
    data: { state: 'scores' },
    loadChildren: () => import('./modules/score/score.routes'),
  },
  {
    path: 'lineups',
    canActivate: [authenticatedGuard],
    data: { state: 'lineups' },
    loadChildren: () => import('./modules/lineup/lineup.routes'),
  },
  {
    path: 'transferts',
    canActivate: [authenticatedGuard],
    data: { state: 'transferts' },
    loadChildren: () => import('./modules/transfert/transfert.routes'),
  },
];
