import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { firstValueFrom, from, merge, Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, share, switchMap, take } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { NotificationService, PushSubscriptionService } from '@data/services';
import { environment } from '@env';
import { PushSubscription, User } from '@data/types';

@Injectable({ providedIn: 'root' })
export class PushService {
  constructor(
    private readonly subscription: PushSubscriptionService,
    private readonly swPush: SwPush,
    private readonly snackBar: MatSnackBar,
    private readonly notificationService: NotificationService,
    private readonly auth: AuthenticationService,
    private readonly router: Router,
  ) {}

  public initialize(): Observable<void> {
    return this.auth.requireUser$.pipe(
      filter(() => environment.production),
      switchMap((user) => this.initializeUser(user)),
    );
  }

  public subscribeToPush(user: User): Observable<void> {
    return this.isSubscribed().pipe(
      filter((s) => !s),
      mergeMap(async () => this.requestSubscription(user)),
      filter((s) => s),
      map(() => {
        this.snackBar.open('Now you are subscribed', undefined, {
          duration: 2000,
        });
      }),
    );
  }

  public unsubscribeFromPush(): Observable<void> {
    return from(this.cancelSubscription()).pipe(
      filter((r) => r),
      map(() => {
        this.snackBar.open('Now you are unsubscribed', undefined, {
          duration: 2000,
        });
      }),
    );
  }

  public isSubscribed(): Observable<boolean> {
    return this.swPush.subscription.pipe(
      map((e) => e !== null),
      share(),
    );
  }

  public isEnabled(): boolean {
    return this.swPush.isEnabled;
  }

  public async convertNativeSubscription(
    pushSubscription: PushSubscriptionJSON,
    userId: number,
  ): Promise<Partial<PushSubscription> | undefined> {
    if (pushSubscription.endpoint && pushSubscription.keys) {
      const e = pushSubscription.expirationTime;
      const psm: Partial<PushSubscription> = {
        id: await this.sha256(pushSubscription.endpoint),
        endpoint: pushSubscription.endpoint,
        public_key: pushSubscription.keys.p256dh,
        auth_token: pushSubscription.keys.auth,
        content_encoding: (PushManager.supportedContentEncodings ?? ['aesgcm'])[0],

        expires_at: e !== null && e !== undefined ? new Date(e) : undefined,
        user_id: userId,
      };
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
    return hashArray.map((b) => `00${b.toString(16)}`.slice(-2)).join('');
  }

  private initializeUser(user: User): Observable<void> {
    return merge(this.subscribeToPush(user).pipe(catchError(() => of())), this.showMessages());
  }

  private showMessages(): Observable<void> {
    return merge(
      this.swPush.messages.pipe(
        map((obj) => {
          const message = obj as { notification: Notification };
          this.notificationService.broadcast(message.notification.title, '');
        }),
      ),
      this.swPush.notificationClicks.pipe(
        map((click) => {
          const data = click.notification.data as { url?: string };
          if (data.url !== undefined) {
            void this.router.navigateByUrl(data.url);
          }
        }),
      ),
    );
  }

  private async requestSubscription(user: User): Promise<boolean> {
    const pushSubscription = await this.swPush.requestSubscription({
      serverPublicKey: environment.vapidPublicKey,
    });
    const sub = await this.convertNativeSubscription(pushSubscription.toJSON(), user.id);
    if (sub) {
      return firstValueFrom(
        this.subscription.add(sub).pipe(
          map(() => true),
          catchError(() => {
            void pushSubscription.unsubscribe();

            return of(false);
          }),
        ),
      );
    }

    return false;
  }

  private async cancelSubscription(): Promise<boolean> {
    // Get active subscription
    const pushSubscription = await firstValueFrom(this.swPush.subscription.pipe(take(1)));
    if (pushSubscription) {
      // Delete the subscription from the backend
      const sub = await this.sha256(pushSubscription.endpoint);

      return firstValueFrom(
        this.subscription.delete(sub).pipe(
          map(() => {
            void pushSubscription.unsubscribe().then().catch();

            return true;
          }),
          catchError(() => of(false)),
        ),
      );
    }

    return true;
  }
}
