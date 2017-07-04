import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { ProfileComponent } from './user/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { ArticleDetailComponent } from './article/article-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'login', loadChildren: 'app/auth/auth.module#AuthModule'  },
  { path: 'profile', component: ProfileComponent},
  { path: 'articles', loadChildren: 'app/article/article.module#ArticleModule', canActivate: [AuthGuard] },
  // { path: 'create_article', component: ArticleDetailComponent, outlet: 'popup'},
  { path: 'championships', loadChildren: 'app/championship/championship.module#ChampionshipModule', canActivate: [AuthGuard] },
  { path: 'clubs', loadChildren: 'app/club/club.module#ClubModule' },
  { path: 'players', loadChildren: 'app/player/player.module#PlayerModule' },
  { path: 'scores', loadChildren: 'app/score/score.module#ScoreModule' },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
