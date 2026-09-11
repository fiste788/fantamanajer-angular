import { inject, Service } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { SwPush } from '@angular/service-worker';

import { catchError, EMPTY, filter, firstValueFrom, from, map, merge, mergeMap, of, share, switchMap, take } from 'rxjs';
import type { Observable, Subscription } from 'rxjs';

import { ENVIRONMENT } from '@env';

import { AuthenticationService } from '@app/authentication';
import { filterNil } from '@app/functions';
import type { PushSubscription, User } from '@data/interfaces';
import { NotificationService as FeatureNotificationService, PushSubscriptionService } from '@data/services';

import { SnackbarNotificationService } from './snackbar-notification.service';

@Service()
export class PushService {

  readonly #auth = inject(AuthenticationService);
  readonly #notificationService = inject(FeatureNotificationService);
  readonly #notService = inject(SnackbarNotificationService);
  readonly #subscription = inject(PushSubscriptionService);
  readonly #swPush = inject(SwPush);

  readonly #user = toObservable(this.#auth.currentUser);

  public init(): Observable<void> {
    return this.#user.pipe(
      filterNil(),
      filter(() => ENVIRONMENT.production),
      switchMap(user => this.#initializeUser(user)),
    );
  }

  public connect(): Subscription {
    return this.init().subscribe();
  }

  public async convertNativeSubscription(pushSubscription: PushSubscriptionJSON, userId: number): Promise<Partial<PushSubscription> | undefined> {
    if (pushSubscription.endpoint && pushSubscription.keys) {
      const { expirationTime } = pushSubscription;
      const psm: Partial<PushSubscription> = {
        auth_token: pushSubscription.keys['auth']!,
        content_encoding: PushManager.supportedContentEncodings[0] ?? 'aesgcm',
        endpoint: pushSubscription.endpoint,
        expires_at: expirationTime !== null && expirationTime !== undefined ? new Date(expirationTime) : undefined,
        id: await this.sha256(pushSubscription.endpoint),
        public_key: pushSubscription.keys['p256dh']!,
        user_id: userId,
      };

      return psm;
    }

    return undefined;
  }

  public isEnabled(): boolean {
    return this.#swPush.isEnabled;
  }

  public isSubscribed(): Observable<boolean> {
    return this.#swPush.subscription.pipe(
      map(subscription => subscription !== null),
      share(),
    );
  }

  public async sha256(message: string): Promise<string> {
    // encode as UTF-8
    const textEncoder = new TextEncoder();
    const messageBuffer = textEncoder.encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);

    // convert ArrayBuffer to Array
    const hashArray = [...new Uint8Array(hashBuffer)];

    // convert bytes to hex string
    return hashArray.map(b => `00${b.toString(16)}`.slice(-2)).join('');
  }

  public subscribeToPush(user: User): Observable<void> {
    return this.isSubscribed().pipe(
      filter(s => !s),
      mergeMap(async () => this.#requestSubscription(user)),
      filter(s => s),
      switchMap(async () => {
        await this.#notService.open('Now you are subscribed', undefined, {
          duration: 2000,
        });
      }),
    );
  }

  public unsubscribeFromPush(): Observable<void> {
    return from(this.#cancelSubscription()).pipe(
      filter(r => r),
      switchMap(async () => {
        await this.#notService.open('Now you are unsubscribed', undefined, {
          duration: 2000,
        });
      }),
    );
  }

  async #cancelSubscription(): Promise<boolean> {
    // Get active subscription
    const pushSubscription = await firstValueFrom(this.#swPush.subscription.pipe(take(1)), {
      defaultValue: undefined,
    });

    if (pushSubscription) {
      // Delete the subscription from the backend
      const sub = await this.sha256(pushSubscription.endpoint);

      return firstValueFrom(
        this.#subscription.deleteSubscription(sub).pipe(
          map(() => {
            void pushSubscription.unsubscribe().then().catch();

            return true;
          }),
          catchError(() => of(false)),
        ),
        { defaultValue: false },
      );
    }

    return true;
  }

  #initializeUser(user: User): Observable<void> {
    return merge(this.subscribeToPush(user).pipe(catchError(() => EMPTY)), this.#showMessages());
  }

  async #requestSubscription(user: User): Promise<boolean> {
    const pushSubscription = await this.#swPush.requestSubscription({
      serverPublicKey: ENVIRONMENT.vapidPublicKey,
    });
    const sub = await this.convertNativeSubscription(pushSubscription.toJSON(), user.id);
    if (sub) {
      return firstValueFrom(
        this.#subscription.createSubscription(sub).pipe(
          map(() => true),
          catchError(() => {
            void pushSubscription.unsubscribe();

            return of(false);
          }),
        ),
        { defaultValue: false },
      );
    }

    return false;
  }

  #showMessages(): Observable<void> {
    return this.#swPush.messages.pipe(
      map((object) => {
        const message = object as {
          notification: Notification;
        };
        this.#notificationService.setNotification(message.notification.title, '');
      }),
    );
  }

}
