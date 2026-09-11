import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import type { Signal } from '@angular/core';
import { inject, linkedSignal, Service, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

import { distinctUntilChanged, filter, first, map, pairwise, startWith, switchMap } from 'rxjs';

import { Direction } from '@app/enums';
import { ScrollService } from '@app/services';
import type { NavigationMode } from '@layout/interfaces';

@Service()
export class LayoutService {

  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #router = inject(Router);
  readonly #scrollService = inject(ScrollService);

  public stable = this.#isStable();

  public readonly fullscreen = linkedSignal({
    computation: (current, previous): boolean => {
      // 1. Dati per il confronto
      const previousTrigger = previous?.source.contextTrigger();
      const currentTrigger = current.contextTrigger();

      // 2. Logica di Rilevamento Evento/Reset
      // L'evento di cambio contesto è rilevato se il trigger attuale è diverso dal precedente
      // e non è il primo ricalcolo (cioè previous esiste).
      const isContextChangeTriggered = previous !== undefined && currentTrigger !== previousTrigger;

      // Condizione di Reset (Massima Priorità)
      // Se l'evento è stato innescato O non siamo in 'bar' mode, resettiamo a FALSE.
      if (isContextChangeTriggered || current.navigationMode !== 'bar') {
        return false;
      }

      // Il resto della tua logica di transizione (che ora può funzionare)
      const previousDirection = previous?.source.direction;
      const currentDirection = current.direction;

      if (previousDirection === Direction.Up && currentDirection === Direction.Down) {
        return true;
      }

      if (previousDirection === Direction.Down && currentDirection === Direction.Up) {
        return false;
      }

      return previous?.value ?? false;
    },
    source: () => ({
      contextTrigger: this.routeContextChanged,
      direction: this.#scrollService.direction(),
      navigationMode: this.navigationMode(),
    }),
  });
  public readonly navigationMode = this.#getNavigationMode(); // Renamed method for clarity
  public readonly navigationStart = this.#getNavigationStart(); // Renamed method for clarity
  public readonly openDrawer = linkedSignal(() => {
    const navigationMode = this.navigationMode();
    this.navigationStart();

    return navigationMode === 'drawer';
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
  public readonly skeletonColors = signal({
    background: '#ffb1c1',
    foreground: '#ffd9df',
  });

  readonly #NAVIGATION_MODE_MAP = new Map<string, NavigationMode>([
    [Breakpoints.Large, 'drawer'],
    [Breakpoints.Medium, 'rail'],
    [Breakpoints.Small, 'rail'],
    [Breakpoints.XLarge, 'drawer'],
    [Breakpoints.XSmall, 'bar'],
  ]);

  public closeDrawer(): void {
    if (this.navigationMode() !== 'drawer') {
      this.openDrawer.set(false);
    }
  }

  public toggleDrawer(isForce?: boolean): void {
    this.openDrawer.set(isForce ?? !this.openDrawer());
  }

  // Renamed method for clarity
  #getNavigationMode(initialValue: NavigationMode = 'bar'): Signal<NavigationMode> {
    return toSignal(
      this.#breakpointObserver.observe([...this.#NAVIGATION_MODE_MAP.keys()]).pipe(
        map((result) => {
          const activeBreakpoint = Object.entries(result.breakpoints).find(([_, matches]) => matches);

          return activeBreakpoint ? (this.#NAVIGATION_MODE_MAP.get(activeBreakpoint[0]) ?? initialValue) : initialValue;
        }),
        distinctUntilChanged(),
      ),
      { requireSync: true },
    );
  }

  // Renamed method for clarity
  #getNavigationStart(): Signal<NavigationStart | undefined> {
    return toSignal(this.#router.events.pipe(filter(event => event instanceof NavigationStart)), {
      initialValue: undefined,
    });
  }

  #isStable(): Signal<boolean> {
    return toSignal(
      this.#router.events.pipe(
        filter(event => event instanceof NavigationEnd),

        first(null, undefined),
        switchMap(
          async () => new Promise((r) => {
            setTimeout(r);
          }),
        ),
        map(() => true),
        startWith(false),
      ),
      { requireSync: true },
    );
  }

  // All'interno del tuo Service/Classe
  #routeContextChangeTrigger(): Signal<number | undefined> {
    return toSignal(
      this.#router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        pairwise(),
        map(([pre, post]) => {
          // Logica per rilevare il cambio di contesto (come la tua)
          const isContextChanged = pre.urlAfterRedirects.split('/', 2)[1] !== post.urlAfterRedirects.split('/', 2)[1];

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

}
