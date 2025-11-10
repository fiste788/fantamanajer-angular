import { AppRouter, WorkerProvider } from '@worker/types';

import { AngularAppHandler } from './angular.handler';
import {
  AngularProviderConfig,
  AngularProviderOption,
  SecurityPolicyOption,
  AdditionalHeadersOption,
  CspConfigOptions,
  AdditionalHeaders,
  CspConfig,
} from './angular.types';

/**
 * Funzione helper per configurare la Policy di Sicurezza (CSP e Nonce).
 * @param cspConfig Le direttive CSP di base.
 * @param options Opzioni per la CSP (es. abilitazione Nonce).
 * @returns Un frammento di configurazione per il provider Angular.
 */
export const withSecurityPolicy = (
  cspConfig: CspConfig,
  options: CspConfigOptions = {},
): SecurityPolicyOption => {
  return {
    securityPolicy: {
      cspConfig,
      options,
    },
  };
};

/**
 * Funzione helper per configurare gli Header di Sicurezza aggiuntivi (es. HSTS, X-Frame-Options).
 * @param headers Un oggetto con gli header chiave-valore.
 * @returns Un frammento di configurazione per il provider Angular.
 */
export const withAdditionalSecurityHeaders = (
  headers: AdditionalHeaders,
): AdditionalHeadersOption => {
  return {
    additionalSecurityHeaders: headers,
  };
};

/**
 * Costruisce l'oggetto di configurazione finale unendo i frammenti forniti.
 * @param options Tutti i frammenti di configurazione passati a provideAngularFallback.
 * @returns La configurazione completa del provider Angular.
 */
const mergeConfig = (options: Array<AngularProviderOption>): AngularProviderConfig => {
  // Configurazione base con valori predefiniti
  const defaultConfig: AngularProviderConfig = {
    securityPolicy: {
      cspConfig: undefined,
      options: { enableNonce: false },
    },
  };

  // Unisce i frammenti di configurazione
  // eslint-disable-next-line unicorn/no-array-reduce
  return options.reduce(
    (acc, current) => ({ ...acc, ...current }),
    defaultConfig,
  ) as AngularProviderConfig;
};

/**
 * Il Provider finale che registra il Controller Angular come fallback universale.
 * @param options Una lista di frammenti di configurazione ottenuti dagli helper `with...`.
 * @returns {WorkerProvider} Una funzione che registra la rotta nel router.
 */
export const provideAngularFallback = (
  ...options: Array<AngularProviderOption>
): WorkerProvider => {
  const config = mergeConfig(options);
  const angularHandler = new AngularAppHandler(config);

  return (router: AppRouter) => {
    // Registra l'handler per tutte le rotte che non sono state precedentemente gestite
    // Questa rotta agisce come fallback Catch-All
    router.all('*', angularHandler.handle);
  };
};
