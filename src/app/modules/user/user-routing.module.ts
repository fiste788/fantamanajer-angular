import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards';

import { SettingsPage } from './pages/settings/settings.page';
import { UserStreamPage } from './pages/user-stream/user-stream.page';
import { UserPage } from './pages/user/user.page';

const routes: Routes = [
  {
    path: '',
    component: UserPage,
    canActivate: [AuthGuard],
    data: {
      state: 'user',
      breadcrumbs: 'Impostazioni'
    },
    children: [
      { path: '', redirectTo: 'profile' },
      { path: 'profile', component: SettingsPage, data: { state: 'settings' } },
      { path: 'stream', component: UserStreamPage, data: { state: 'stream' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
  static components = [
    UserPage,
    SettingsPage,
    UserStreamPage
  ];
}
