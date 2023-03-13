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
    loadChildren: async () => import('./modules/home/home.routes'),
  },
  {
    path: 'auth',
    data: { state: 'auth' },
    loadChildren: async () => import('./modules/auth/auth.routes'),
  },
  {
    path: 'clubs',
    data: { state: 'clubs' },
    loadChildren: async () => import('./modules/club/club.routes'),
  },
  {
    path: 'players',
    data: { state: 'players' },
    loadChildren: async () => import('./modules/player/player.routes'),
  },
  {
    path: 'user',
    canActivate: [authenticatedGuard],
    data: { state: 'user' },
    loadChildren: async () => import('./modules/user/user.routes'),
  },
  {
    path: 'championships',
    canActivate: [authenticatedGuard],
    data: { state: 'championships' },
    loadChildren: async () => import('./modules/championship/championship.routes'),
  },
  {
    path: 'teams',
    canActivate: [authenticatedGuard],
    data: { state: 'teams' },
    loadChildren: async () => import('./modules/team/team.routes'),
  },
  {
    path: 'articles',
    canActivate: [authenticatedGuard],
    data: { state: 'articles' },
    loadChildren: async () => import('./modules/article/article.routes'),
  },
  {
    path: 'scores',
    canActivate: [authenticatedGuard],
    data: { state: 'scores' },
    loadChildren: async () => import('./modules/score/score.routes'),
  },
  {
    path: 'lineups',
    canActivate: [authenticatedGuard],
    data: { state: 'lineups' },
    loadChildren: async () => import('./modules/lineup/lineup.routes'),
  },
  {
    path: 'transferts',
    canActivate: [authenticatedGuard],
    data: { state: 'transferts' },
    loadChildren: async () => import('./modules/transfert/transfert.routes'),
  },
];
