import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import {
  Observable,
  Subscription,
  timer,
  fromEvent,
  filter,
  map,
  switchMap,
  first,
  tap,
  from,
} from 'rxjs';

import { filterNil } from '@app/functions';

import { NotificationService } from './notification.service';
import { WINDOW } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  readonly #window = inject<Window>(WINDOW);
  readonly #platformId = inject(PLATFORM_ID);
  readonly #notificationService = inject(NotificationService);
  readonly #swUpdate = inject(SwUpdate);
  readonly #appRef = inject(ApplicationRef);

  public readonly beforeInstall$? = this.#getBeforeInstall();

  public init(): Observable<void> {
    return this.#checkForUpdates().pipe(
      filter((u) => u),
      switchMap(() => this.#promptUpdate()),
    );
  }

  public connect(): Subscription {
    return this.init().subscribe();
  }

  #getBeforeInstall(): Observable<BeforeInstallPromptEvent> | undefined {
    return isPlatformBrowser(this.#platformId)
      ? fromEvent<BeforeInstallPromptEvent>(this.#window, 'beforeinstallprompt').pipe(
          tap((e) => {
            e.preventDefault();
          }),
        )
      : undefined;
  }

  #checkForUpdates(): Observable<boolean> {
    const appIsStable$ = this.#appRef.isStable.pipe(
      filter((isStable) => isStable),
      first((isStable) => isStable),
    );
    const everySixHours$ = timer(0, 6 * 60 * 60 * 1000);

    return appIsStable$.pipe(
      filter(() => this.#swUpdate.isEnabled),
      switchMap(() => everySixHours$),
      switchMap(async () => this.#swUpdate.checkForUpdate()),
    );
  }

  #promptUpdate(): Observable<void> {
    return from(
      this.#notificationService.open("Nuova versione dell'app disponibile", 'Aggiorna', {
        duration: 30_000,
      }),
    ).pipe(
      filterNil(),
      //map((s) => s.onAction()),
      switchMap(async () => this.#swUpdate.activateUpdate()),
      map(() => this.#window.location.reload()),
    );
  }
}
