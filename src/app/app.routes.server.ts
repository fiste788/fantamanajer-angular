import { RenderMode, ServerRoute } from '@angular/ssr';

export default [{ path: '**', renderMode: RenderMode.Server }] satisfies Array<ServerRoute>;
