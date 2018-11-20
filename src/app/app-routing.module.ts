import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { McBreadcrumbsModule } from 'ngx-breadcrumbs-ui';
import { AuthGuard } from './shared/auth/auth.guard';
import { NotLoggedGuard } from './shared/auth/not-logged.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './shared/auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { state: 'home' } },
  { path: 'login', component: LoginComponent, canActivate: [NotLoggedGuard], data: { state: 'login' } },
  { path: 'account', loadChildren: 'app/account/account.module#AccountModule', data: { state: 'account' } },
  { path: 'clubs', loadChildren: 'app/entities/club/club.module#ClubModule', data: { state: 'club' } },
  { path: 'players', loadChildren: 'app/entities/player/player.module#PlayerModule', data: { state: 'player' } },
  // { path: 'profile', component: ProfileComponent,  canActivate: [AuthGuard]},
  {
    path: 'profile',
    loadChildren: 'app/entities/user/user.module#UserModule',
    canActivate: [AuthGuard],
    data: { state: 'profile' }
  },
  {
    path: 'championships',
    loadChildren: 'app/entities/championship/championship.module#ChampionshipModule',
    canActivate: [AuthGuard],
    data: { state: 'championship' }
  },
  {
    path: 'teams',
    loadChildren: 'app/entities/team/team.module#TeamModule',
    canActivate: [AuthGuard],
    data: { state: 'team' }
  },
  {
    path: 'scores',
    loadChildren: 'app/entities/score/score.module#ScoreModule',
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
