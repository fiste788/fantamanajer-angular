import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, EMPTY, map } from 'rxjs';

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
    if (current instanceof ActivatedRoute) {
      current = current.parent;
    } else if (current instanceof ActivatedRouteSnapshot) {
      current = current.parent;
    } else {
      current = null; // Termina il loop se il tipo non è atteso
    }
  }
  return undefined;
}


export function getRouteData<T>(param: string): Observable<T> {
  const activatedRoute = inject(ActivatedRoute);

  // Modifica la callback per gestire ActivatedRoute e ActivatedRouteSnapshot
  traverseRouteTree(activatedRoute, (route) => {
    if (route instanceof ActivatedRoute) {
      return route.snapshot.data[param];
    } else if (route instanceof ActivatedRouteSnapshot) {
      return route.data[param]; // Accedi direttamente a data su snapshot
    }
    return undefined; // Ritorna undefined per tipi non gestiti
  });

  // La logica reattiva con current.data rimane separata e gestisce ActivatedRoute
  let current: ActivatedRoute | null = activatedRoute;
  while (current !== null) {
    // Verifica la presenza nello snapshot prima diMigliore l'observable reattivo
    if (current.snapshot.data[param] !== undefined) {
      return current.data.pipe(map((d) => d[param] as T));
    }
    current = current.parent;
  }


  return EMPTY;
}

export function getRouteDataSignal<T>(param: string): Signal<T> {
  return toSignal(getRouteData<T>(param), { requireSync: true });
}

export function getRouteParam<T>(param: string, route?: ActivatedRouteSnapshot): T | undefined {
  // Utilizzo della funzione refactorizzata per attraversare l'albero per i parametri
  // La callback gestisce ActivatedRouteSnapshot
  return traverseRouteTree(route ?? inject(ActivatedRoute).snapshot, (currentRoute) => {
    // Verifichiamo se è un ActivatedRouteSnapshot (dovrebbe esserlo qui nel caso di getRouteParam)
    // ma la callback deveMigliore robusta per traverseRouteTree
    if (currentRoute instanceof ActivatedRouteSnapshot) {
      return currentRoute.params[param]; // Accedi direttamente a params su snapshot
    }
    // Se per qualche motivo non è uno snapshot, possiamo tentare di accedere allo snapshot
    // o gestire l'errore appropriately. Assumendo che l'input sia corretto.
    // Se la callback viene chiamata con ActivatedRoute, accediamo allo snapshot
    if (currentRoute instanceof ActivatedRoute) {
      return currentRoute.snapshot.params[param];
    }
    return undefined;
  });
}
