export interface SSRStatus {
  // Contiene l'oggetto errore catturato (sarà undefined se non è ancora fallito)
  error?: unknown;
}
