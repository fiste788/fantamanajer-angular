import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { McBreadcrumbsModule } from 'mc-breadcrumbs';
import { AuthGuard } from './shared/auth/auth.guard';
import { NotLoggedGuard } from './shared/auth/not-logged.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './shared/auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [NotLoggedGuard] },
  { path: 'account', loadChildren: 'app/account/account.module#AccountModule' },
  { path: 'clubs', loadChildren: 'app/entities/club/club.module#ClubModule' },
  { path: 'players', loadChildren: 'app/entities/player/player.module#PlayerModule' },
  // { path: 'profile', component: ProfileComponent,  canActivate: [AuthGuard]},
  {
    path: 'profile',
    loadChildren: 'app/entities/user/user.module#UserModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'articles',
    loadChildren: 'app/entities/article/article.module#ArticleModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'teams',
    loadChildren: 'app/entities/team/team.module#TeamModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'championships',
    loadChildren: 'app/entities/championship/championship.module#ChampionshipModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'scores',
    loadChildren: 'app/entities/score/score.module#ScoreModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/championships',
    loadChildren: 'app/admin/championship/championship.module#ChampionshipModule',
    canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    McBreadcrumbsModule.forRoot()
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
