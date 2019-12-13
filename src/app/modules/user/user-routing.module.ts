import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards';
import { SettingsComponent } from './pages/settings/settings.component';
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
      { path: 'profile', component: SettingsComponent, data: { state: 'settings' } },
      { path: 'stream', component: UserStreamComponent, data: { state: 'stream' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
