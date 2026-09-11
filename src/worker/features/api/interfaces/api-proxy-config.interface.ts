/**
Configurazione specifica per il provider proxy API.
*/
export interface ApiProxyConfig {
  /**
  Il prefisso della rotta da intercettare e fare il proxy (es. '/api')
  */
  apiEndpoint: string;
}
