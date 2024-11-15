import { RenderMode, ServerRoute } from '@angular/ssr';

export default [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
  {
    path: '/clubs',
    renderMode: RenderMode.Prerender,
  },
] satisfies Array<ServerRoute>;
