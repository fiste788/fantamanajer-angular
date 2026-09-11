import { isPlatformBrowser } from '@angular/common';
import type { Signal } from '@angular/core';
import { ApplicationRef, inject, linkedSignal, PLATFORM_ID, Service, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';

import { filter, first, firstValueFrom, fromEvent, switchMap, tap, timer } from 'rxjs';
import type { Observable, Subscription } from 'rxjs';

import { SnackbarNotificationService } from './snackbar-notification.service';
import { WINDOW } from './window.service';

@Service()
export class PwaService {

  readonly #appRef = inject(ApplicationRef);
  readonly #notificationService = inject(SnackbarNotificationService);
  readonly #platformId = inject(PLATFORM_ID);
  readonly #swUpdate = inject(SwUpdate);
  readonly #window = inject<Window>(WINDOW);

  public readonly beforeInstallSignal = linkedSignal(this.#getBeforeInstall());

  public init(): Observable<void> {
    return this.#checkForUpdates().pipe(
      filter(u => u),
      switchMap(async () => this.#promptUpdate()),
    );
  }

  public connect(): Subscription {
    return this.init().subscribe();
  }

  #checkForUpdates(): Observable<boolean> {
    const appIsStable$ = this.#appRef.isStable.pipe(
      filter(isStable => isStable),
      first(isStable => isStable),
    );
    const everySixHours$ = timer(0, 6 * 60 * 60 * 1000);

    return appIsStable$.pipe(
      filter(() => this.#swUpdate.isEnabled),
      switchMap(() => everySixHours$),
      switchMap(async () => this.#swUpdate.checkForUpdate()),
    );
  }

  #getBeforeInstall(): Signal<BeforeInstallPromptEvent | undefined> {
    return isPlatformBrowser(this.#platformId)
      ? toSignal(
        fromEvent<BeforeInstallPromptEvent>(this.#window, 'beforeinstallprompt').pipe(
          tap((event) => {
            event.preventDefault();
          }),
        ),
        { initialValue: undefined },
      )
      : signal<BeforeInstallPromptEvent | undefined>(undefined);
  }

  async #promptUpdate(): Promise<void> {
    const notification = await this.#notificationService.open("Nuova versione dell'app disponibile", 'Aggiorna', {
      duration: 30_000,
    });

    const isActivateUpdate = await firstValueFrom(notification.onAction().pipe(switchMap(async () => this.#swUpdate.activateUpdate())), { defaultValue: false });

    if (isActivateUpdate) {
      this.#window.location.reload();
    }
  }

}
