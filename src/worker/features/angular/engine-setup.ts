import { AngularAppEngine } from '@angular/ssr';

/**
 * Funzione di configurazione statica e memoizzazione del motore Angular SSR.
 * Qui si impostano hook e proprietà statiche una sola volta.
 */
export const configureAngularEngine = (() => {
  const App = AngularAppEngine;
  // Esempio di configurazione statica
  App.ɵallowStaticRouteRender = false;
  App.ɵhooks.on('html:transform:pre', (ctx) => ctx.html);

  return App;
})();
