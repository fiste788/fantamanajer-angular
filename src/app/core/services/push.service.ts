import { EventEmitter, Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { from, Observable, of } from 'rxjs';
import { catchError, defaultIfEmpty, filter, flatMap, map, share, switchMap, take } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { NotificationService, PushSubscriptionService } from '@app/http';
import { environment } from '@env';
import { PushSubscription, User } from '@shared/models';

import { ApplicationService } from './application.service';
import { WINDOW } from './window.service';

@Injectable({ providedIn: 'root' })
export class PushService {
  readonly beforeInstall: EventEmitter<BeforeInstallPromptEvent> = new EventEmitter<BeforeInstallPromptEvent>();

  constructor(
    @Inject(WINDOW) private readonly window: Window,
    private readonly subscription: PushSubscriptionService,
    private readonly swPush: SwPush,
    private readonly snackBar: MatSnackBar,
    private readonly notificationService: NotificationService,
    private readonly app: ApplicationService,
    private readonly auth: AuthenticationService,
    private readonly swUpdate: SwUpdate,
    private readonly router: Router
  ) {
    this.window.addEventListener('beforeinstallprompt', (e: BeforeInstallPromptEvent) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.beforeInstall.emit(e);
    });
    this.checkForUpdates();
    this.auth.userChange$.subscribe(this.initializeUser.bind(this));
  }

  checkForUpdates(): void {
    this.swUpdate.available.pipe(
      map(() => this.snackBar.open(
        'Nuova versione dell\'app disponibile',
        'Aggiorna'
      )),
      switchMap(ref => ref.onAction())
    )
      .subscribe(() => {
        this.window.location.reload();
      });
  }

  initializeUser(user?: User): void {
    if (user && environment.production) {
      this.subscribeToPush();
      this.showMessages();
    }
  }

  showMessages(): void {
    this.swPush.messages.subscribe((message: any) => {
      this.notificationService.broadcast(message.notification.title, '');
    });
    this.swPush.notificationClicks.subscribe(click => {
      if (click.notification.data.url) {
        void this.router.navigateByUrl(click.notification.data.url);
      }
    });
  }

  subscribeToPush(): void {
    this.isSubscribed()
      .pipe(
        filter(s => !s),
        flatMap(() => from(this.requestSubscription())),
        filter(s => s)
      )
      .subscribe(() => {
        this.snackBar.open('Now you are subscribed', undefined, {
          duration: 2000
        });
      });
  }

  unsubscribeFromPush(): void {
    from(this.cancelSubscription())
      .pipe(filter(r => r))
      .subscribe(() => {
        this.snackBar.open('Now you are unsubscribed', undefined, {
          duration: 2000
        });
      });
  }

  isSubscribed(): Observable<boolean> {
    return this.swPush.subscription
      .pipe(
        // tslint:disable-next-line: no-null-keyword
        defaultIfEmpty(null),
        map(e => e !== null),
        share()
      );
  }

  isEnabled(): boolean {
    return this.swPush.isEnabled;
  }

  private async requestSubscription(): Promise<boolean> {
    const pushSubscription = await this.swPush.requestSubscription({
      serverPublicKey: environment.vapidPublicKey
    });
    if (this.app.user) {
      const pushSubscriptionModel = new PushSubscription();
      const sub = await pushSubscriptionModel.convertNativeSubscription(pushSubscription.toJSON(), this.app.user.id);
      if (sub) {
        return this.subscription.add(sub)
          .pipe(
            map(s => s !== null),
            catchError(() => {
              void pushSubscription.unsubscribe();

              return of(false);
            })
          )
          .toPromise();
      }
    }

    return false;
  }

  private async cancelSubscription(): Promise<boolean> {
    // Get active subscription
    const pushSubscription = await this.swPush.subscription.pipe(take(1))
      .toPromise();
    if (pushSubscription !== null) {
      // Delete the subscription from the backend
      const pushSubscriptionModel = new PushSubscription();
      const sub = await pushSubscriptionModel.sha256(pushSubscription.endpoint);

      return this.subscription.delete(sub)
        .pipe(
          map(() => {
            pushSubscription
              .unsubscribe()
              .then()
              .catch();

            return true;
          }),
          catchError(() => of(false)))
        .toPromise();
    }

    return true;
  }
}
