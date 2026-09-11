import type { Signal } from '@angular/core';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { EMPTY, map } from 'rxjs';
import type { Observable } from 'rxjs';

export function getRouteData<T>(parameter: string): Observable<T> {
  const activatedRoute = inject(ActivatedRoute);

  // Modifica la callback per gestire ActivatedRoute e ActivatedRouteSnapshot
  traverseRouteTree(activatedRoute, (route): T | undefined => {
    if (route instanceof ActivatedRoute) {
      return route.snapshot.data[parameter] as T;
    }

    if (route instanceof ActivatedRouteSnapshot) {
      return route.data[parameter] as T; // Accedi direttamente a data su snapshot
    }

    return undefined;

    // Ritorna undefined per tipi non gestiti
  });

  // La logica reattiva con current.data rimane separata e gestisce ActivatedRoute
  let current: ActivatedRoute | null = activatedRoute;
  while (current !== null) {
    // Verifica la presenza nello snapshot prima diMigliore l'observable reattivo
    if (current.snapshot.data[parameter] !== undefined) {
      return current.data.pipe(map(d => d[parameter] as T));
    }
    current = current.parent;
  }

  return EMPTY;
}

export function getRouteDataSignal<T>(parameter: string): Signal<T> {
  return toSignal(getRouteData<T>(parameter), { requireSync: true });
}

export function getRouteParam<T>(parameter: string, route?: ActivatedRouteSnapshot): T | undefined {
  // Utilizzo della funzione refactorizzata per attraversare l'albero per i parametri
  // La callback gestisce ActivatedRouteSnapshot
  return traverseRouteTree(route ?? inject(ActivatedRoute).snapshot, (currentRoute): T | undefined => {
    // Verifichiamo se è un ActivatedRouteSnapshot (dovrebbe esserlo qui nel caso di getRouteParam)
    // ma la callback deveMigliore robusta per traverseRouteTree
    if (currentRoute instanceof ActivatedRouteSnapshot) {
      return currentRoute.params[parameter] as T; // Accedi direttamente a params su snapshot
    }

    // Se per qualche motivo non è uno snapshot, possiamo tentare di accedere allo snapshot o gestire l'errore appropriately. Assumendo che l'input sia corretto.
    // Se la callback viene chiamata con ActivatedRoute, accediamo allo snapshot
    if (currentRoute instanceof ActivatedRoute) {
      return currentRoute.snapshot.params[parameter] as T;
    }

    return undefined; // Ritorna undefined per tipi non gestiti
  });
}

// Funzione privata per attraversare l'albero delle route e applicare una callback (Refactoring)
function traverseRouteTree<T>(
  initialRoute: ActivatedRoute | ActivatedRouteSnapshot | null,
  getValue: (route: ActivatedRoute | ActivatedRouteSnapshot) => T | undefined,
): T | undefined {
  let current = initialRoute;
  while (current !== null) {
    const value = getValue(current); // La callback gestisce il tipo
    if (value !== undefined) {
      return value;
    }

    // Spostiamo qui l'accesso al parent in modo sicuro, gestendo entrambi i tipi
    current = current instanceof ActivatedRoute || current instanceof ActivatedRouteSnapshot ? (current.parent ?? null) : null;
  }

  return undefined;
}
