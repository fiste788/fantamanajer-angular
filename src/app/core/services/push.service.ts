import { EventEmitter, Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { filter, isEmpty, map, take } from 'rxjs/operators';
import { PushSubscription, User } from '../models';
import { ApplicationService } from './application.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { PushSubscriptionService } from './push-subscription.service';
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
    private readonly auth: AuthService,
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
    this.swUpdate.available.subscribe(() => {
      const snackBarRef = this.snackBar.open(
        'Nuova versione dell\'app disponibile',
        'Aggiorna'
      );

      snackBarRef.onAction()
        .subscribe(() => {
          this.window.location.reload();
        });
    });
  }

  initializeUser(user?: User): void {
    if (user && environment.production) {
      this.subscribeToPush();
      this.showMessages();
    }
  }

  subscribeToPush(): void {
    this.swPush.subscription.pipe(
      isEmpty(),
      filter(s => s)
    )
      .subscribe(() => {
        this.requestSubscription();
      });
  }

  unsubscribeFromPush(): void {
    // Get active subscription
    this.swPush.subscription.pipe(take(1))
      .subscribe(pushSubscription => {
        if (pushSubscription !== null) {
          // Delete the subscription from the backend
          this.subscription.delete(pushSubscription.endpoint)
            .subscribe(res => {
              this.snackBar.open('Now you are unsubscribed', undefined, {
                duration: 2000
              });

              // Unsubscribe current client (browser)
              pushSubscription
                .unsubscribe()
                .then()
                .catch();
            });
        }
      });

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

  isSubscribed(): Observable<boolean> {
    return this.swPush.subscription
      .pipe(
        isEmpty(),
        map(e => !e)
      );
  }

  private requestSubscription(): void {
    this.swPush.requestSubscription({
      serverPublicKey: environment.vapidPublicKey
    })
      .then(pushSubscription => {
        if (this.app.user) {
          const pushSubscriptionModel = new PushSubscription();
          void pushSubscriptionModel.convertNativeSubscription(pushSubscription, this.app.user.id)
            .then(sub => {
              if (sub) {
                this.subscription.add(sub)
                  .subscribe(() => {
                    this.snackBar.open('Now you are subscribed', undefined, {
                      duration: 2000
                    });
                  }, () => pushSubscription.unsubscribe());
              }
            });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
}
