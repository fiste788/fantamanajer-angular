import { AngularAppEngine } from '@angular/ssr';

/**
 * Funzione di configurazione statica e memoizzazione del motore Angular SSR.
 * Qui si impostano hook e proprietà statiche una sola volta.
 */
// Configuriamo la classe una sola volta al caricamento del modulo
const App = AngularAppEngine;
App.ɵallowStaticRouteRender = false;
App.ɵhooks.on('html:transform:pre', (ctx) => ctx.html);

// Esportiamo direttamente l'istanza creata UNA VOLTA SOLA
export const sharedAngularAppEngine = new App();
