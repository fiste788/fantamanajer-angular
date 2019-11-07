import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { take, defaultIfEmpty } from 'rxjs/operators';
import { environment } from '@env/environment';
import { PushSubscription, User } from '../models';
import { PushSubscriptionService } from './push-subscription.service';
import { NotificationService } from './notification.service';
import { ApplicationService } from './application.service';
import { AuthService } from './auth.service';
import { WindowRefService } from './window-ref.service';

@Injectable({ providedIn: 'root' })
export class PushService {
  @Output() beforeInstall: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(
    public subscription: PushSubscriptionService,
    public swPush: SwPush,
    public snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private app: ApplicationService,
    private auth: AuthService,
    private swUpdate: SwUpdate,
    private winRef: WindowRefService
  ) {
    this.winRef.nativeWindow.addEventListener('beforeinstallprompt', (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.beforeInstall.emit(e);
    });
    this.checkForUpdates();
    this.auth.loggedUser.subscribe(this.initializeUser.bind(this));
  }

  checkForUpdates() {
    this.swUpdate.available.subscribe(event => {
      console.log(
        '[App] Update available: current version is',
        event.current,
        'available version is',
        event.available
      );
      const snackBarRef = this.snackBar.open(
        'Nuova versione dell\'app disponibile',
        'Aggiorna'
      );

      snackBarRef.onAction().subscribe(() => {
        this.winRef.nativeWindow.location.reload();
      });
    });
  }

  initializeUser(user?: User) {
    if (user && environment.production) {
      this.subscribeToPush();
      this.showMessages();
    }
  }

  subscribeToPush(): void {
    this.swPush.subscription.pipe(defaultIfEmpty(null)).subscribe(subs => {
      if (!subs) {
        this.requestSubscription();
      }
    });
  }

  private requestSubscription(): void {
    this.swPush
      .requestSubscription({
        serverPublicKey: environment.vapidPublicKey
      })
      .then(pushSubscription => {
        const pushSubscriptionModel = new PushSubscription();
        pushSubscriptionModel.convertNativeSubscription(pushSubscription, this.app.user.id).then(sub => {
          // Passing subscription object to our backend
          this.subscription.add(sub).subscribe(res => {
            this.snackBar.open(
              'Now you are subscribed',
              null,
              {
                duration: 2000
              }
            );
          }, () => pushSubscription.unsubscribe());
        });
      }).catch(err => {
        console.error(err);
      });
  }

  unsubscribeFromPush(): void {
    // Get active subscription
    this.swPush.subscription.pipe(take(1)).subscribe(pushSubscription => {
      // Delete the subscription from the backend
      this.subscription.delete(pushSubscription.endpoint).subscribe(res => {
        this.snackBar.open(
          'Now you are unsubscribed',
          null,
          {
            duration: 2000
          }
        );

        // Unsubscribe current client (browser)
        pushSubscription
          .unsubscribe()
          .then(success => {
            console.log('[App] Unsubscription successful', success);
          })
          .catch(err => {
            console.log('[App] Unsubscription failed', err);
          });
      });
    });
  }

  showMessages(): void {
    this.swPush.messages.subscribe((message: any) => {
      console.log('[App] Push message received', message);
      this.notificationService.broadcast(message.notification.title, '');
    });
    this.swPush.notificationClicks.subscribe(click => {
      console.log('[App] Click notification', click);
      if (click.notification.data.url) {
        this.app.getRouter().navigateByUrl(click.notification.data.url);
        // this.router.navigateByUrl();
      }
    });
  }
}
