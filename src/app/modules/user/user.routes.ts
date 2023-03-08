import { Routes } from '@angular/router';

import { authenticatedGuard } from '@app/guards';

import { DeviceListPage } from './pages/device-list/device-list.page';
import { SettingsPage } from './pages/settings/settings.page';
import { UserPage } from './pages/user/user.page';
import { UserStreamPage } from './pages/user-stream/user-stream.page';

const routes: Routes = [
  {
    path: '',
    component: UserPage,
    canActivate: [authenticatedGuard],
    data: {
      breadcrumbs: 'Impostazioni',
      state: 'user',
    },
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: SettingsPage, data: { state: 'settings' } },
      { path: 'stream', component: UserStreamPage, data: { state: 'stream' } },
      { path: 'devices', component: DeviceListPage, data: { state: 'devices' } },
    ],
  },
];

export default routes;
