import type { Route } from '@angular/router';

export default [
  {
    data: { state: 'home', viewTransitionOutlet: 'player-detail' },
    loadChildren: async () => import('./modules/home/home.routes'),
    path: '',
    pathMatch: 'full',
  },
  {
    path: 'home',
    redirectTo: '',
  },
  {
    data: { state: 'auth' },
    loadChildren: async () => import('./modules/auth/auth.routes'),
    path: 'auth',
  },
  {
    data: { state: 'clubs' },
    loadChildren: async () => import('./modules/club/club.routes'),
    path: 'clubs',
  },
  {
    data: { state: 'players' },
    loadChildren: async () => import('./modules/player/player.routes'),
    path: 'players',
  },
  {
    data: { state: 'user' },
    loadChildren: async () => import('./modules/user/user.routes'),
    path: 'user',
  },
  {
    data: { state: 'championships' },
    loadChildren: async () => import('./modules/championship/championship.routes'),
    path: 'championships',
  },
  {
    data: { state: 'teams' },
    loadChildren: async () => import('./modules/team/team.routes'),
    path: 'teams',
  },
  {
    data: { state: 'articles' },
    loadChildren: async () => import('./modules/article/article.routes'),
    path: 'articles',
  },
  {
    data: { state: 'scores' },
    loadChildren: async () => import('./modules/score/score.routes'),
    path: 'scores',
  },
  {
    data: { state: 'lineups' },
    loadChildren: async () => import('./modules/lineup/lineup.routes'),
    path: 'lineups',
  },
  {
    data: { state: 'transferts' },
    loadChildren: async () => import('./modules/transfert/transfert.routes'),
    path: 'transferts',
  },
] satisfies Route[];
