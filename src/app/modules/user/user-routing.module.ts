import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserStreamComponent } from './components/user-stream/user-stream.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: {
      state: 'user',
      breadcrumbs: 'Impostazioni'
    },
    children: [
      { path: '', redirectTo: 'profile' },
      { path: 'profile', component: ProfileComponent, data: { state: 'profile' } },
      { path: 'stream', component: UserStreamComponent, data: { state: 'stream' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
