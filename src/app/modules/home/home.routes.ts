import { Routes } from '@angular/router';

import { HomePage } from './pages/home.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePage,
    data: {
      state: 'home',
    },
  },
];

export default routes;
