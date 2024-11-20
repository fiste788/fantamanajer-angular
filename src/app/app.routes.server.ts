import { RenderMode, ServerRoute } from '@angular/ssr';

export default [
  {
    path: 'clubs',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
] satisfies Array<ServerRoute>;
