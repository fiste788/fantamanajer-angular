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
  { path: 'clubs', loadChildren: 'app/modules/club/club.module#ClubModule', data: { state: 'club' } },
  { path: 'players', loadChildren: 'app/modules/player/player.module#PlayerModule', data: { state: 'player' } },
  {
    path: 'profile',
    loadChildren: 'app/modules/user/user.module#UserModule',
    canActivate: [AuthGuard],
    data: { state: 'profile' }
  },
  {
    path: 'championships',
    loadChildren: 'app/modules/championship/championship.module#ChampionshipModule',
    canActivate: [AuthGuard],
    data: { state: 'championship' }
  },
  {
    path: 'teams',
    loadChildren: 'app/modules/team/team.module#TeamModule',
    canActivate: [AuthGuard],
    data: { state: 'team' }
  },
  {
    path: 'articles',
    loadChildren: 'app/modules/article/article.module#ArticleModule',
    canActivate: [AuthGuard],
    data: { state: 'article' }
  },
  {
    path: 'scores',
    loadChildren: 'app/modules/score/score.module#ScoreModule',
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
