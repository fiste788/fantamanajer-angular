import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, PLATFORM_ID } from '@angular/core';
import { IsActiveMatchOptions, Router, ViewTransitionInfo } from '@angular/router';

import { CurrentTransitionService } from '@app/services';

// Definizione di costanti per le classi CSS (Refactoring suggerito)
const DIRECTION_LEFT_CLASS = 'direction-left';
const DIRECTION_RIGHT_CLASS = 'direction-right';
const LIST_TO_DETAIL_CLASS = 'list-to-detail';
const DETAIL_TO_LIST_CLASS = 'detail-to-list';

// Definizione della configurazione IsActiveMatchOptions come costante (Refactoring suggerito)
const SKIP_TRANSITION_MATCH_OPTIONS: IsActiveMatchOptions = {
  paths: 'exact',
  matrixParams: 'exact',
  fragment: 'ignored',
  queryParams: 'ignored',
};

export function onViewTransitionCreated(info: ViewTransitionInfo): void {
  const currentTransitionService = inject(CurrentTransitionService);
  const document = inject(DOCUMENT);
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  const router = inject(Router);
  const currentNavigation = router.currentNavigation();

  // Logica di estrazione dell'URL di destinazione con controllo null (Refactoring suggerito)
  const targetUrl = currentNavigation?.finalUrl; // Utilizzo di optional chaining e toString()

  // Se l'URL di destinazione non è disponibile, non possiamoMigliore la logica di skip transition
  if (!targetUrl) {
    console.warn('Could not get target URL for view transition.');
    // Decidere se saltare la transizione o gestirla diversamente in questo caso
    info.transition.skipTransition();

    return; // Usciamo dalla funzione
  }

  // Skip the transition if the only thing
  // changing is the fragment and queryParams
  // Utilizzo della configurazione costante (Refactoring suggerito)
  if (router.isActive(targetUrl, SKIP_TRANSITION_MATCH_OPTIONS)) {
    info.transition.skipTransition();
  } else {
    // Imposta lo stato della transizione corrente nel servizio
    currentTransitionService.currentTransition.set({
      transition: info,
      previousUrl: currentNavigation?.previousNavigation?.finalUrl, // Utilizzo di optional chaining e toString()
      finalUrl: targetUrl,
    });
    // Update current transition when animation finishes

    void info.transition.finished.finally(() => {
      currentTransitionService.currentTransition.set(undefined);
      // Utilizzo delle costanti per la rimozione delle classi CSS (Refactoring suggerito)
      if (isBrowser) {
        document.documentElement.classList.remove(
          DIRECTION_LEFT_CLASS,
          DIRECTION_RIGHT_CLASS,
          LIST_TO_DETAIL_CLASS,
          DETAIL_TO_LIST_CLASS,
        );
      }
    });
  }
}
