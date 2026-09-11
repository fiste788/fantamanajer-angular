import type { Route } from '@angular/router';

import { HomePage } from './pages/home.page';

export default [
  {
    component: HomePage,
    data: {
      description: "L'app per gestire al meglio la tua lega del fantacalcio",
      ogDescription: "L'app per gestire al meglio la tua lega del fantacalcio",
      ogImage: '/icons/icon-180x180.webp',
      ogTitle: 'FantaManajer',
      state: 'home-outlet',
      viewTransitionOutlet: 'player-outlet',
    },
    path: '',
    pathMatch: 'full',
  },
] satisfies Route[];
