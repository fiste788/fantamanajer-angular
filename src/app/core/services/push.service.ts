import { Injectable, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { SwPush } from '@angular/service-worker';
import {
  EMPTY,
  firstValueFrom,
  from,
  merge,
  Observable,
  of,
  Subscription,
  catchError,
  filter,
  map,
  mergeMap,
  share,
  switchMap,
  take,
} from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { filterNil } from '@app/functions';
import {
  NotificationService as FeatureNotificationService,
  PushSubscriptionService,
} from '@data/services';
import { PushSubscription, User } from '@data/types';
import { environment } from '@env';

import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class PushService {
  readonly #subscription = inject(PushSubscriptionService);
  readonly #swPush = inject(SwPush);
  readonly #notificationService = inject(FeatureNotificationService);
  readonly #notService = inject(NotificationService);
  readonly #auth = inject(AuthenticationService);
  readonly #user = toObservable(this.#auth.user);

  public init(): Observable<void> {
    return this.#user.pipe(
      filterNil(),
      filter(() => environment.production),
      switchMap((user) => this.#initializeUser(user)),
    );
  }

  public connect(): Subscription {
    return this.init().subscribe();
  }

  public subscribeToPush(user: User): Observable<void> {
    return this.isSubscribed().pipe(
      filter((s) => !s),
      mergeMap(async () => this.#requestSubscription(user)),
      filter((s) => s),
      switchMap(async () => {
        await this.#notService.open('Now you are subscribed', undefined, {
          duration: 2000,
        });
      }),
    );
  }

  public unsubscribeFromPush(): Observable<void> {
    return from(this.#cancelSubscription()).pipe(
      filter((r) => r),
      switchMap(async () => {
        await this.#notService.open('Now you are unsubscribed', undefined, {
          duration: 2000,
        });
      }),
    );
  }

  public isSubscribed(): Observable<boolean> {
    return this.#swPush.subscription.pipe(
      map((e) => e !== null),
      share(),
    );
  }

  public isEnabled(): boolean {
    return this.#swPush.isEnabled;
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
        public_key: pushSubscription.keys['p256dh'],
        auth_token: pushSubscription.keys['auth'],
        content_encoding: PushManager.supportedContentEncodings[0] ?? 'aesgcm',
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
    const hashArray = [...new Uint8Array(hashBuffer)];

    // convert bytes to hex string
    return hashArray.map((b) => `00${b.toString(16)}`.slice(-2)).join('');
  }

  #initializeUser(user: User): Observable<void> {
    return merge(this.subscribeToPush(user).pipe(catchError(() => EMPTY)), this.#showMessages());
  }

  #showMessages(): Observable<void> {
    return this.#swPush.messages.pipe(
      map((obj) => {
        const message = obj as {
          notification: Notification;
        };
        this.#notificationService.broadcast(message.notification.title, '');
      }),
    );
  }

  async #requestSubscription(user: User): Promise<boolean> {
    const pushSubscription = await this.#swPush.requestSubscription({
      serverPublicKey: environment.vapidPublicKey,
    });
    const sub = await this.convertNativeSubscription(pushSubscription.toJSON(), user.id);
    if (sub) {
      return firstValueFrom(
        this.#subscription.add(sub).pipe(
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

  async #cancelSubscription(): Promise<boolean> {
    // Get active subscription
    const pushSubscription = await firstValueFrom(this.#swPush.subscription.pipe(take(1)), {
      defaultValue: undefined,
    });
    if (pushSubscription) {
      // Delete the subscription from the backend
      const sub = await this.sha256(pushSubscription.endpoint);

      return firstValueFrom(
        this.#subscription.delete(sub).pipe(
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
}
