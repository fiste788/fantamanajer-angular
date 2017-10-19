import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { NotLoggedGuard } from './auth/not-logged.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [NotLoggedGuard] },
  { path: 'clubs', loadChildren: 'app/club/club.module#ClubModule' },
  { path: 'players', loadChildren: 'app/player/player.module#PlayerModule' },
  // { path: 'profile', component: ProfileComponent,  canActivate: [AuthGuard]},
  { path: 'profile', loadChildren: 'app/user/user-lazy.module#UserLazyModule',  canActivate: [AuthGuard],},
  { path: 'articles', loadChildren: 'app/article/article.module#ArticleModule', canActivate: [AuthGuard] },
  { path: 'teams', loadChildren: 'app/team/team.module#TeamModule',  canActivate: [AuthGuard]},
  { path: 'championships', loadChildren: 'app/championship/championship.module#ChampionshipModule', canActivate: [AuthGuard] },
  { path: 'scores', loadChildren: 'app/score/score.module#ScoreModule', canActivate: [AuthGuard] },

];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
