import type { ApiError } from './error.interface'; // Aggiornato l'import

export interface ErrorResponse {
  data?: ApiError; // Utilizzo del nuovo nome dell'interfaccia
}
