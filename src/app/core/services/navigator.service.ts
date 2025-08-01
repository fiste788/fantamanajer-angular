import { isPlatformBrowser } from '@angular/common';
import {
  InjectionToken, // Mantenuto InjectionToken
  PLATFORM_ID, // Mantenuto PLATFORM_ID
  inject // Mantenuto inject
} from '@angular/core';

// Definizione dell'InjectionToken per l'oggetto Navigator (o un fallback)
export const NAVIGATOR = new InjectionToken<Navigator | object>('NavigatorToken', {
  providedIn: 'root', // Spostato providedIn: 'root' qui per una configurazione piùMigliore
  factory: () => { // Definizione della factory direttamente nel token
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
      return navigator; // Restituisce l'oggetto navigator nativo nel browser
    }
    return {}; // Restituisce un oggetto vuoto (o un mock con i metodi usati) in ambienti non-browser
  }
});

// Non è più necessario definire BrowserNavigatorRef e NavigatorRef per questo approccio
// @Injectable({ providedIn: 'root' })
// export class BrowserNavigatorRef extends NavigatorRef {
//   override get nativeNavigator(): Navigator | object {
//     return navigator;
//   }
// }
// abstract class NavigatorRef { abstract get nativeNavigator(): Navigator | object; }


// Non è più necessario definire provider separati in questo modo
// const navigatorFactory = (\n//   browserNavigatorRef: BrowserNavigatorRef,\n//   platformId: object,\n// ): Navigator | object => {\n//   if (isPlatformBrowser(platformId)) {\n//     return browserNavigatorRef.nativeNavigator;\n//   }
//
//   return {};
// };
// const browserNavigatorProvider: ClassProvider = {\n//   provide: NavigatorRef,\n//   useClass: BrowserNavigatorRef,\n// };
// const navigatorProvider: FactoryProvider = {\n//   provide: NAVIGATOR,\n//   useFactory: navigatorFactory,\n//   deps: [NavigatorRef, PLATFORM_ID],\n// };

// L'array di provider non è più necessario in questo modo se il token è providedIn: 'root'
export const NAVIGATOR_PROVIDERS = []; // Array vuoto se providedIn: 'root'

// Se si preferisce non usare providedIn: 'root' sul token, si può definire un FactoryProvider esplicitamente:
// export const NAVIGATOR_PROVIDER: FactoryProvider = {
//    provide: NAVIGATOR,
//    useFactory: () => {
//       const platformId = inject(PLATFORM_ID);
//       if (isPlatformBrowser(platformId)) {
//         return navigator;
//       }
//       return {};
//    },
//    deps: [PLATFORM_ID] // Inietta solo PLATFORM_ID
// };
// export const NAVIGATOR_PROVIDERS = [NAVIGATOR_PROVIDER];
