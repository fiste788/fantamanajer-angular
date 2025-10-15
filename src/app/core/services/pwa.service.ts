import { isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  Injectable,
  PLATFORM_ID,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import {
  Observable,
  Subscription,
  timer,
  fromEvent,
  filter,
  switchMap,
  first,
  tap,
  firstValueFrom,
} from 'rxjs';

import { toWritableSignal } from '@app/functions';

import { SnackbarNotificationService } from './snackbar-notification.service';
import { WINDOW } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  readonly #window = inject<Window>(WINDOW);
  readonly #platformId = inject(PLATFORM_ID);
  readonly #notificationService = inject(SnackbarNotificationService);
  readonly #swUpdate = inject(SwUpdate);
  readonly #appRef = inject(ApplicationRef);

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

  #getBeforeInstall(): WritableSignal<BeforeInstallPromptEvent | undefined> {
    return isPlatformBrowser(this.#platformId)
      ? toWritableSignal(
          fromEvent<BeforeInstallPromptEvent>(this.#window, 'beforeinstallprompt').pipe(
            tap((e) => {
              e.preventDefault();
            }),
          ),
          { initialValue: undefined },
        )
      : signal<BeforeInstallPromptEvent | undefined>(undefined);
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

  async #promptUpdate(): Promise<void> {
    const notification = await this.#notificationService.open(
      "Nuova versione dell'app disponibile",
      'Aggiorna',
      {
        duration: 30_000,
      },
    );

    const activateUpdate = await firstValueFrom(
      notification.onAction().pipe(switchMap(async () => this.#swUpdate.activateUpdate())),
      { defaultValue: false },
    );
    if (activateUpdate) {
      this.#window.location.reload();
    }
  }
}
