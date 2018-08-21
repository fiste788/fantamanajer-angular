import { Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { PushSubscriptionService } from '../../entities/push-subscription/push-subscription.service';
import { NotificationService } from '../../entities/notification/notification.service';
import { Notification } from '../../entities/notification/notification';
import { environment } from 'environments/environment';
import { PushSubscription } from '../../entities/push-subscription/push-subscription';
import { Observable } from 'rxjs';
import { take, defaultIfEmpty } from 'rxjs/operators';
import { ApplicationService } from '../../core/application.service';
import { AuthService } from '../auth/auth.service';
import { WindowRef } from '../../core/WindowRef';
import { User } from '../../entities/user/user';

@Injectable()
export class PushService {
  private subscribed = false;
  // private notificationComponent: NotificationListComponent = null;

  constructor(
    public subscription: PushSubscriptionService,
    public swPush: SwPush,
    public snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private app: ApplicationService,
    private auth: AuthService,
    private swUpdate: SwUpdate,
    private winRef: WindowRef
  ) {
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
        'Newer version of the app is available',
        'Refresh'
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

  subscribeToPush() {
    this.swPush.subscription.pipe(defaultIfEmpty(null)).subscribe(subs => {
      if (!subs) {
        this.requestSubscription();
      }
    });
  }

  private requestSubscription() {
    this.swPush
      .requestSubscription({
        serverPublicKey: environment.vapidPublicKey
      })
      .then(pushSubscription => {
        const pushSubscriptionModel = new PushSubscription();
        pushSubscriptionModel.convertNativeSubscription(pushSubscription, this.app.user.id).then(sub => {
          // Passing subscription object to our backend
          this.subscription.add(sub).subscribe(res => {
            const snackBarRef = this.snackBar.open(
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

  unsubscribeFromPush() {
    // Get active subscription
    this.swPush.subscription.pipe(take(1)).subscribe(pushSubscription => {
      // Delete the subscription from the backend
      this.subscription.delete(pushSubscription.endpoint).subscribe(res => {
        const snackBarRef = this.snackBar.open(
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

  showMessages() {
    this.swPush.messages.subscribe(message => {
      console.log('[App] Push message received', message);
      this.notificationService.broadcast(message['notification']['title'], '');
    });
  }
}
