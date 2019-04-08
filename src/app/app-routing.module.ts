import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { McBreadcrumbsModule } from 'ngx-breadcrumbs-ui';
import { AuthGuard, NotLoggedGuard } from '@app/core/guards';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './modules/auth/pages/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { state: 'home' } },
  { path: 'login', component: LoginComponent, canActivate: [NotLoggedGuard], data: { state: 'login' } },
  { path: 'clubs', loadChildren: () => import('app/modules/club/club.module').then(m => m.ClubModule), data: { state: 'club' } },
  { path: 'players', loadChildren: () => import('app/modules/player/player.module').then(m => m.PlayerModule), data: { state: 'player' } },
  {
    path: 'profile',
    loadChildren: () => import('app/modules/user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard],
    data: { state: 'profile' }
  },
  {
    path: 'championships',
    loadChildren: () => import('app/modules/championship/championship.module').then(m => m.ChampionshipModule),
    canActivate: [AuthGuard],
    data: { state: 'championship' }
  },
  {
    path: 'teams',
    loadChildren: () => import('app/modules/team/team.module').then(m => m.TeamModule),
    canActivate: [AuthGuard],
    data: { state: 'team' }
  },
  {
    path: 'articles',
    loadChildren: () => import('app/modules/article/article.module').then(m => m.ArticleModule),
    canActivate: [AuthGuard],
    data: { state: 'article' }
  },
  {
    path: 'scores',
    loadChildren: () => import('app/modules/score/score.module').then(m => m.ScoreModule),
    canActivate: [AuthGuard],
    data: { state: 'scores' }
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
    McBreadcrumbsModule.forRoot()
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
