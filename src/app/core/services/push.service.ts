import { EventEmitter, Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, share, switchMap, take } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { NotificationService, PushSubscriptionService } from '@app/http';
import { environment } from '@env';
import { PushSubscription, User } from '@shared/models';

import { ApplicationService } from './application.service';
import { WINDOW } from './window.service';

@Injectable({ providedIn: 'root' })
export class PushService {
  public readonly beforeInstall: EventEmitter<BeforeInstallPromptEvent> = new EventEmitter<BeforeInstallPromptEvent>();

  constructor(
    @Inject(WINDOW) private readonly window: Window,
    private readonly subscription: PushSubscriptionService,
    private readonly swPush: SwPush,
    private readonly snackBar: MatSnackBar,
    private readonly notificationService: NotificationService,
    private readonly app: ApplicationService,
    private readonly auth: AuthenticationService,
    private readonly swUpdate: SwUpdate,
    private readonly router: Router,
  ) {
    this.window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.beforeInstall.emit(e);
    });
    this.checkForUpdates();
    this.auth.userChange$.subscribe(this.initializeUser.bind(this));
  }

  public checkForUpdates(): void {
    this.swUpdate.available.pipe(
      map(() => this.snackBar.open(
        'Nuova versione dell\'app disponibile',
        'Aggiorna',
      )),
      switchMap(ref => ref.onAction()),
    )
      .subscribe(() => {
        this.window.location.reload();
      });
  }

  public initializeUser(user?: User): void {
    if (user && environment.production) {
      this.subscribeToPush();
      this.showMessages();
    }
  }

  public showMessages(): void {
    this.swPush.messages.subscribe((obj) => {
      const message = obj as { notification: Notification };
      this.notificationService.broadcast(message.notification.title, '');
    });
    this.swPush.notificationClicks.subscribe((click) => {
      if (click.notification.data.url) {
        void this.router.navigateByUrl(click.notification.data.url);
      }
    });
  }

  public subscribeToPush(): void {
    this.isSubscribed()
      .pipe(
        filter(s => !s),
        mergeMap(() => from(this.requestSubscription())),
        filter(s => s),
      )
      .subscribe(() => {
        this.snackBar.open('Now you are subscribed', undefined, {
          duration: 2000,
        });
      });
  }

  public unsubscribeFromPush(): void {
    from(this.cancelSubscription())
      .pipe(filter(r => r))
      .subscribe(() => {
        this.snackBar.open('Now you are unsubscribed', undefined, {
          duration: 2000,
        });
      });
  }

  public isSubscribed(): Observable<boolean> {
    return this.swPush.subscription
      .pipe(
        map(e => e !== null),
        share(),
      );
  }

  public isEnabled(): boolean {
    return this.swPush.isEnabled;
  }

  public async convertNativeSubscription(pushSubscription: PushSubscriptionJSON, userId: number): Promise<PushSubscription | undefined> {
    if (pushSubscription.endpoint && pushSubscription.keys) {
      const psm = new PushSubscription();
      psm.id = await this.sha256(pushSubscription.endpoint);
      psm.endpoint = pushSubscription.endpoint;
      psm.public_key = pushSubscription.keys.p256dh;
      psm.auth_token = pushSubscription.keys.auth;
      psm.content_encoding = (PushManager.supportedContentEncodings ?? ['aesgcm'])[0];
      const e = pushSubscription.expirationTime;
      psm.expires_at = e !== null && e !== undefined ? new Date(e) : undefined;
      psm.user_id = userId;

      return psm;
    }

    return undefined;
  }

  public async sha256(message: string): Promise<string> {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    return hashArray.map(b => (`00${b.toString(16)}`).slice(-2))
      .join('');
  }

  private async requestSubscription(): Promise<boolean> {
    const pushSubscription = await this.swPush.requestSubscription({
      serverPublicKey: environment.vapidPublicKey,
    });
    if (this.app.user) {
      const sub = await this.convertNativeSubscription(pushSubscription.toJSON(), this.app.user.id);
      if (sub) {
        return this.subscription.add(sub)
          .pipe(
            map(() => true),
            catchError(() => {
              void pushSubscription.unsubscribe();

              return of(false);
            }),
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
      const sub = await this.sha256(pushSubscription.endpoint);

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
