import { Route } from '@angular/router';

export default [
  {
    path: '',
    pathMatch: 'full',
    data: { state: 'home' },
    loadChildren: async () => import('./modules/home/home.routes'),
  },
  {
    path: 'home',
    redirectTo: '',
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
    data: { state: 'user' },
    loadChildren: async () => import('./modules/user/user.routes'),
  },
  {
    path: 'championships',
    data: { state: 'championships' },
    loadChildren: async () => import('./modules/championship/championship.routes'),
  },
  {
    path: 'teams',
    data: { state: 'teams' },
    loadChildren: async () => import('./modules/team/team.routes'),
  },
  {
    path: 'articles',
    data: { state: 'articles' },
    loadChildren: async () => import('./modules/article/article.routes'),
  },
  {
    path: 'scores',
    data: { state: 'scores' },
    loadChildren: async () => import('./modules/score/score.routes'),
  },
  {
    path: 'lineups',
    data: { state: 'lineups' },
    loadChildren: async () => import('./modules/lineup/lineup.routes'),
  },
  {
    path: 'transferts',
    data: { state: 'transferts' },
    loadChildren: async () => import('./modules/transfert/transfert.routes'),
  },
] satisfies Array<Route>;
