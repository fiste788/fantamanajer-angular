import { AngularAppEngine } from '@angular/ssr';

/**
 * Gestore dello stato di inizializzazione del Worker.
 */
const WorkerState = {
  isCold: true,
  consumeStatus() {
    if (WorkerState.isCold) {
      WorkerState.isCold = false;

      return 'COLD';
    }

    return 'WARM';
  },
};

/**
 * Funzione di configurazione statica e memoizzazione del motore Angular SSR.
 * Qui si impostano hook e proprietà statiche una sola volta.
 */
// Configuriamo la classe una sola volta al caricamento del modulo
const App = AngularAppEngine;
App.ɵallowStaticRouteRender = false;
App.ɵhooks.on('html:transform:pre', (ctx) => ctx.html);

console.log('🚀 [System] Script Evaluation: Bootstrapping Global Scope');

// Esportiamo direttamente l'istanza creata UNA VOLTA SOLA
export const sharedAngularAppEngine = new App({
  allowedHosts: ['*.fantamanajer.it', 'fantamanajer.it'], // Configurazione degli host consentiti per il rendering
  trustProxyHeaders: true,
});

export const getWorkerStatus = (): string => WorkerState.consumeStatus();
