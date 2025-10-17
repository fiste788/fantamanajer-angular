import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, Signal, inject, signal, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, map, pairwise, switchMap, startWith, first, distinctUntilChanged } from 'rxjs';

import { Direction } from '@app/enums';
import { ScrollService } from '@app/services';

type NavigationMode = 'bar' | 'rail' | 'drawer';

// #navigationModeMap is now a constant outside the class
const NAVIGATION_MODE_MAP = new Map<string, NavigationMode>([
  [Breakpoints.XSmall, 'bar'],
  [Breakpoints.Small, 'rail'],
  [Breakpoints.Medium, 'rail'],
  [Breakpoints.Large, 'drawer'],
  [Breakpoints.XLarge, 'drawer'],
]);

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #scrollService = inject(ScrollService);
  readonly #router = inject(Router);

  public readonly navigationMode = this.#getNavigationMode(); // Renamed method for clarity

  public readonly openDrawer = linkedSignal(() => {
    const navigationMode = this.navigationMode();
    this.navigationStart();

    return navigationMode === 'drawer';
  });

  public readonly fullscreen = linkedSignal({
    source: () => ({
      contextTrigger: this.routeContextChanged,
      navigationMode: this.navigationMode(),
      direction: this.#scrollService.direction(),
    }),
    computation: (current, previous): boolean => {
      // 1. Dati per il confronto
      const prevTrigger = previous?.source.contextTrigger;
      const currentTrigger = current.contextTrigger;

      // 2. Logica di Rilevamento Evento/Reset
      // L'evento di cambio contesto è rilevato se il trigger attuale è diverso dal precedente
      // e non è il primo ricalcolo (cioè previous esiste).
      const contextChangeTriggered = previous !== undefined && currentTrigger !== prevTrigger;

      // Condizione di Reset (Massima Priorità)
      // Se l'evento è stato innescato O non siamo in 'bar' mode, resettiamo a FALSE.
      if (contextChangeTriggered || current.navigationMode !== 'bar') {
        return false;
      }

      // Il resto della tua logica di transizione (che ora può funzionare)
      const prevDir = previous?.source.direction;
      const currentDir = current.direction;

      if (prevDir === Direction.Up && currentDir === Direction.Down) {
        return true;
      }
      if (prevDir === Direction.Down && currentDir === Direction.Up) {
        return false;
      }

      return previous?.value ?? false;
    },
  });

  public readonly openFab = linkedSignal(() => {
    const navigationMode = this.navigationMode();
    const direction = this.#scrollService.direction();

    // Gestisce la logica precedentemente nell'effect
    if (navigationMode === 'bar' && direction === Direction.Down) {
      return false;
    }

    return false;
  });
  public readonly routeContextChanged = this.#routeContextChangeTrigger();
  public readonly navigationStart = this.#getNavigationStart(); // Renamed method for clarity
  public readonly skeletonColors = signal({
    foreground: '#ffd9df',
    background: '#ffb1c1',
  });
  public stable = this.#isStable();

  public closeDrawer(): void {
    if (this.navigationMode() !== 'drawer') {
      this.openDrawer.set(false);
    }
  }

  public toggleDrawer(value?: boolean): void {
    this.openDrawer.set(value ?? !this.openDrawer());
  }

  // Renamed method for clarity
  #getNavigationMode(initialValue: NavigationMode = 'bar'): Signal<NavigationMode> {
    return toSignal(
      this.#breakpointObserver.observe([...NAVIGATION_MODE_MAP.keys()]).pipe(
        map((result) => {
          for (const query of Object.keys(result.breakpoints)) {
            if (result.breakpoints[query]) {
              return NAVIGATION_MODE_MAP.get(query) ?? initialValue;
            }
          }

          return initialValue;
        }),
        distinctUntilChanged(),
      ),
      { requireSync: true },
    );
  }

  // All'interno del tuo Service/Classe
  #routeContextChangeTrigger(): Signal<number | undefined> {
    return toSignal(
      this.#router.events.pipe(
        filter((evt): evt is NavigationEnd => evt instanceof NavigationEnd),
        pairwise(),
        map(([pre, post]) => {
          // Logica per rilevare il cambio di contesto (come la tua)
          const isContextChanged =
            pre.urlAfterRedirects.split('/')[1] !== post.urlAfterRedirects.split('/')[1];

          // Emette un valore unico (timestamp) SOLO se il contesto è cambiato.
          // Altrimenti, non emette nulla (grazie al 'filter' successivo)
          return isContextChanged ? Date.now() : undefined;
        }),
        // Filtra i valori 'undefined': il toSignal emette un nuovo valore SOLO
        // quando c'è un cambio di contesto effettivo (il timestamp).
        filter((value): value is number => value !== undefined),
      ),
      // Inizializzato a undefined, in modo che il linkedSignal non si attivi subito
      { initialValue: undefined },
    );
  }

  #isStable(): Signal<boolean> {
    return toSignal(
      this.#router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        // eslint-disable-next-line unicorn/no-null
        first(null, undefined),
        switchMap(async () => new Promise((r) => setTimeout(r))),
        map(() => true),
        startWith(false),
      ),
      { requireSync: true },
    );
  }

  // Renamed method for clarity
  #getNavigationStart(): Signal<NavigationStart | undefined> {
    return toSignal(this.#router.events.pipe(filter((evt) => evt instanceof NavigationStart)), {
      initialValue: undefined,
    });
  }
}
