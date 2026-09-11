import { AngularAppEngine } from '@angular/ssr';

/**
Gestore dello stato di inizializzazione del Worker.
*/
const WorkerState = {
  consumeStatus() {
    if (WorkerState.isCold) {
      WorkerState.isCold = false;

      return 'COLD';
    }

    return 'WARM';
  },
  isCold: true,
};

/**
Funzione di configurazione statica e memoizzazione del motore Angular SSR.
Qui si impostano hook e proprietà statiche una sola volta.
*/
// Configuriamo la classe una sola volta al caricamento del modulo
const app = AngularAppEngine;
app.ɵallowStaticRouteRender = false;
app.ɵhooks.on('html:transform:pre', context => context.html);

console.log('🚀 [System] Script Evaluation: Bootstrapping Global Scope');

// Esportiamo direttamente l'istanza creata UNA VOLTA SOLA
export const sharedAngularAppEngine = new app({
  allowedHosts: ['*.fantamanajer.it', 'fantamanajer.it'], // Configurazione degli host consentiti per il rendering
});

export const getWorkerStatus = (): string => WorkerState.consumeStatus();
