import { Route } from '@angular/router';

import { HomePage } from './pages/home.page';

export default [
  {
    path: '',
    pathMatch: 'full',
    component: HomePage,
    data: {
      state: 'home',
    },
  },
] as Array<Route>;
