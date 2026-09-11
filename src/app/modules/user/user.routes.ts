import type { Route } from '@angular/router';

import { authenticatedGuard } from '@app/guards';

import { PasskeyListPage } from './pages/passkey-list/passkey-list.page';
import { SettingsPage } from './pages/settings/settings.page';
import { UserStreamPage } from './pages/user-stream/user-stream.page';
import { UserPage } from './pages/user/user.page';

export default [
  {
    canActivate: [authenticatedGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'profile' },
      { component: SettingsPage, data: { state: 'settings' }, path: 'profile' },
      { component: UserStreamPage, data: { state: 'stream' }, path: 'stream' },
      { component: PasskeyListPage, data: { state: 'passkeys' }, path: 'passkeys' },
    ],
    component: UserPage,
    data: {
      breadcrumbs: 'Impostazioni',
      state: 'user-outlet',
    },
    path: '',
  },
] satisfies Route[];
