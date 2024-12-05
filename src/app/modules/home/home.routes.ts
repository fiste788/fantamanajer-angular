import { Route } from '@angular/router';

import { HomePage } from './pages/home.page';

export default [
  {
    path: '',
    pathMatch: 'full',
    component: HomePage,
    data: {
      state: 'home',
      description: "L'app per gestire al meglio la tua lega del fantacalcio",
      ogDescription: "L'app per gestire al meglio la tua lega del fantacalcio",
      ogImage: '/icons/icon-180x180.webp',
      ogTitle: 'FantaManajer',
    },
  },
] satisfies Array<Route>;
