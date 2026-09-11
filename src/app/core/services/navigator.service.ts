import { isPlatformBrowser } from '@angular/common';
import {
  inject, // Mantenuto inject
  InjectionToken, // Mantenuto InjectionToken
  PLATFORM_ID, // Mantenuto PLATFORM_ID
} from '@angular/core';

// Definizione dell'InjectionToken per l'oggetto Navigator (o un fallback)
export const NAVIGATOR = new InjectionToken<Navigator | object>('NavigatorToken', {
  factory: () => {
    // Definizione della factory direttamente nel token
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
      return navigator; // Restituisce l'oggetto navigator nativo nel browser
    }

    return {}; // Restituisce un oggetto vuoto (o un mock con i metodi usati) in ambienti non-browser
  },
  providedIn: 'root', // Spostato providedIn: 'root' qui per una configurazione piùMigliore
});

// L'array di provider non è più necessario in questo modo se il token è providedIn: 'root'
export const NAVIGATOR_PROVIDERS = []; // Array vuoto se providedIn: 'root'
