/**
 * Errore personalizzato lanciato quando si verifica un fallimento durante il rendering SSR di Angular.
 * Questo permette al router di livello superiore (bootstrap) di catturare e gestire
 * in modo specifico i problemi di rendering, separandoli dagli errori di rete o di routing.
 */
export class AngularSSRFailureError extends Error {
  constructor(
    message: string,
    public readonly innerError: unknown,
  ) {
    super(`Angular SSR failed: ${message}`);
    this.name = 'AngularSSRFailureError';
  }
}
