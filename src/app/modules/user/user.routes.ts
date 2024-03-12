import { Route } from '@angular/router';

import { authenticatedGuard } from '@app/guards';

import { PasskeyListPage } from './pages/passkey-list/passkey-list.page';
import { SettingsPage } from './pages/settings/settings.page';
import { UserPage } from './pages/user/user.page';
import { UserStreamPage } from './pages/user-stream/user-stream.page';

export default [
  {
    path: '',
    component: UserPage,
    canActivate: [authenticatedGuard],
    data: {
      breadcrumbs: 'Impostazioni',
      state: 'user-outlet',
    },
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: SettingsPage, data: { state: 'settings' } },
      { path: 'stream', component: UserStreamPage, data: { state: 'stream' } },
      { path: 'passkeys', component: PasskeyListPage, data: { state: 'passkeys' } },
    ],
  },
] as Array<Route>;
