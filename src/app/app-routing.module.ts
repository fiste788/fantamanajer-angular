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
    loadChildren: async () => import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'auth',
    data: { state: 'auth' },
    loadChildren: async () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'clubs',
    data: { state: 'clubs' },
    loadChildren: async () => import('./modules/club/club.module').then((m) => m.ClubModule),
  },
  {
    path: 'players',
    data: { state: 'players' },
    loadChildren: async () => import('./modules/player/player.module').then((m) => m.PlayerModule),
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    data: { state: 'user' },
    loadChildren: async () => import('./modules/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'championships',
    canActivate: [AuthGuard],
    data: { state: 'championships' },
    loadChildren: async () =>
      import('./modules/championship/championship.module').then((m) => m.ChampionshipModule),
  },
  {
    path: 'teams',
    canActivate: [AuthGuard],
    data: { state: 'teams' },
    loadChildren: async () => import('./modules/team/team.module').then((m) => m.TeamModule),
  },
  {
    path: 'articles',
    canActivate: [AuthGuard],
    data: { state: 'articles' },
    loadChildren: async () =>
      import('./modules/article/article.module').then((m) => m.ArticleModule),
  },
  {
    path: 'scores',
    canActivate: [AuthGuard],
    data: { state: 'scores' },
    loadChildren: async () => import('./modules/score/score.module').then((m) => m.ScoreModule),
  },
  {
    path: 'lineups',
    canActivate: [AuthGuard],
    data: { state: 'lineups' },
    loadChildren: async () => import('./modules/lineup/lineup.module').then((m) => m.LineupModule),
  },
  {
    path: 'transferts',
    canActivate: [AuthGuard],
    data: { state: 'transferts' },
    loadChildren: async () =>
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
