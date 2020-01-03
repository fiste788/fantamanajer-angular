import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotLoggedGuard, AuthGuard } from '@app/core/guards';
import { LogoutComponent } from './pages/logout/logout.component';
import { LoginComponent } from './pages/login/login.component';
import { RouterOutletComponent } from '@app/shared/components/router-outlet/router-outlet.component';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'article-outlet' },
    children: [
      { path: 'login', component: LoginComponent, canActivate: [NotLoggedGuard], data: { state: 'login' } },
      { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard], data: { state: 'logout' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
