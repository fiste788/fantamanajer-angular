import { bootstrapWorker } from './core/bootstrap';
import { workerConfig } from './core/worker.config';

// Qui si usa la funzione di bootstrap che accetta la configurazione,
// proprio come 'bootstrapApplication' in Angular.
export default bootstrapWorker(workerConfig);
