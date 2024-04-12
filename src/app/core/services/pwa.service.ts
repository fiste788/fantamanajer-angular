import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { Observable, Subscription, timer, fromEvent } from 'rxjs';
import { filter, map, switchMap, first, tap } from 'rxjs/operators';

import { WINDOW } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  public readonly beforeInstall$?: Observable<BeforeInstallPromptEvent>;

  constructor(
    @Inject(WINDOW) private readonly window: Window,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly snackBar: MatSnackBar,
    private readonly swUpdate: SwUpdate,
    private readonly zone: NgZone,
    private readonly appRef: ApplicationRef,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.beforeInstall$ = fromEvent<BeforeInstallPromptEvent>(
        this.window,
        'beforeinstallprompt',
      ).pipe(
        tap((e) => {
          e.preventDefault();
        }),
      );
    }
  }

  public init(): Observable<void> {
    return this.checkForUpdates().pipe(
      filter((u) => u),
      switchMap(() => this.promptUpdate()),
    );
  }

  public connect(): Subscription {
    return this.init().subscribe();
  }

  private checkForUpdates(): Observable<boolean> {
    const appIsStable$ = this.appRef.isStable.pipe(
      filter((isStable) => isStable),
      first((isStable) => isStable),
    );
    const everySixHours$ = timer(0, 6 * 60 * 60 * 1000);

    return appIsStable$.pipe(
      filter(() => this.swUpdate.isEnabled),
      switchMap(() => everySixHours$),
      switchMap(async () => this.swUpdate.checkForUpdate()),
    );
  }

  private promptUpdate(): Observable<void> {
    return this.zone.run(() => {
      return this.snackBar
        .open("Nuova versione dell'app disponibile", 'Aggiorna', { duration: 30_000 })
        .onAction()
        .pipe(
          switchMap(async () => this.swUpdate.activateUpdate()),
          map(() => this.window.location.reload()),
        );
    });
  }
}
