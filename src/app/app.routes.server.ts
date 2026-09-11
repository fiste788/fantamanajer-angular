import type { ServerRoute } from '@angular/ssr';
import { RenderMode } from '@angular/ssr';

export default [
  {
    path: 'clubs',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
] satisfies ServerRoute[];
