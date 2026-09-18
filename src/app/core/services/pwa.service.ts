import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, inject, linkedSignal, PLATFORM_ID, Service, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';

import { filter, first, firstValueFrom, fromEvent, Observable, Subscription, switchMap, tap, timer } from 'rxjs';

import { SnackbarNotificationService } from './snackbar-notification.service';
import { WINDOW } from './window.service';

@Service()
export class PwaService {
  readonly #appRef = inject(ApplicationRef);
  readonly #notificationService = inject(SnackbarNotificationService);
  readonly #platformId = inject(PLATFORM_ID);
  readonly #swUpdate = inject(SwUpdate);
  readonly #window = inject<Window>(WINDOW);

  public readonly beforeInstallSignal = this.#getBeforeInstall();

  public init(): Observable<void> {
    return this.#checkForUpdates().pipe(
      filter((u) => u),
      switchMap(async () => this.#promptUpdate()),
    );
  }

  public connect(): Subscription {
    return this.init().subscribe();
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

  #getBeforeInstall(): WritableSignal<BeforeInstallPromptEvent | undefined> {
    if (!isPlatformBrowser(this.#platformId)) {
      return signal<BeforeInstallPromptEvent | undefined>(undefined);
    }

    // 1. Converti l'Observable in un ReadonlySignal nativo
    const promptEvent = toSignal(fromEvent<BeforeInstallPromptEvent>(this.#window, 'beforeinstallprompt').pipe(tap((e) => e.preventDefault())), {
      initialValue: undefined,
    });

    // 2. Collega un linkedSignal: è scrivibile (.set / .update) e si aggiorna
    // automaticamente quando promptEvent() emette un nuovo valore
    return linkedSignal(() => promptEvent());
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
