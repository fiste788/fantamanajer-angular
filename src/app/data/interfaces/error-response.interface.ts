import { ApiError } from './error.model'; // Aggiornato l'import

export interface ErrorResponse {
  data?: ApiError; // Utilizzo del nuovo nome dell'interfaccia
}
