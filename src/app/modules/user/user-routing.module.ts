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
      breadcrumbs: 'Impostazioni',
      state: 'user',
    },
    children: [
      { path: '', redirectTo: 'profile' },
      { path: 'profile', component: SettingsPage, data: { state: 'settings' } },
      { path: 'stream', component: UserStreamPage, data: { state: 'stream' } },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class UserRoutingModule {
  public static components = [
    UserPage,
    SettingsPage,
    UserStreamPage,
  ];
}
