import { ApplicationRef, Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { concat, fromEvent, interval, Observable } from 'rxjs';
import { filter, map, switchMap, tap, first } from 'rxjs/operators';

import { WINDOW } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  public readonly beforeInstall$: Observable<BeforeInstallPromptEvent>;

  constructor(
    @Inject(WINDOW) private readonly window: Window,
    private readonly snackBar: MatSnackBar,
    private readonly swUpdate: SwUpdate,
    private readonly appRef: ApplicationRef,
  ) {
    this.beforeInstall$ = fromEvent<BeforeInstallPromptEvent>(
      this.window,
      'beforeinstallprompt',
    ).pipe(
      tap((e) => {
        //this.window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
      }),
    );
  }

  public initialize(): Observable<void> {
    return this.checkForUpdates().pipe(
      filter((u) => u),
      switchMap(() => this.promptUpdate()),
    );
  }

  private checkForUpdates(): Observable<boolean> {
    const appIsStable$ = this.appRef.isStable.pipe(
      filter((isStable) => isStable),
      first((isStable) => isStable),
    );
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    return everySixHoursOnceAppIsStable$.pipe(
      filter(() => this.swUpdate.isEnabled),
      switchMap(async () => this.swUpdate.checkForUpdate()),
    );
  }

  private promptUpdate(): Observable<void> {
    return this.snackBar
      .open("Nuova versione dell'app disponibile", 'Aggiorna')
      .onAction()
      .pipe(
        switchMap(async () => this.swUpdate.activateUpdate()),
        map(() => this.window.location.reload()),
      );
  }
}
