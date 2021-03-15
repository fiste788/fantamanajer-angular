import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { share, tap } from 'rxjs/operators';

import { UserService } from '@data/services';
import { ApplicationService, PushService } from '@app/services';
import { cardCreationAnimation } from '@shared/animations';
import { User } from '@data/types';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./settings.page.scss'],
  templateUrl: './settings.page.html',
})
export class SettingsPage implements OnInit, OnDestroy {
  @HostBinding('@cardCreationAnimation') public a = '';

  public user$: Observable<User>;
  public user: User;
  public repeatPassword: string;
  public push$: Observable<boolean>;
  public enabled: boolean;

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly app: ApplicationService,
    private readonly userService: UserService,
    private readonly pushService: PushService,
  ) {}

  public ngOnInit(): void {
    if (this.app.user) {
      this.user = this.app.user;
    }
    this.enabled = this.pushService.isEnabled();
    this.push$ = this.pushService.isSubscribed();
  }

  public save(): void {
    if (this.user?.password === this.repeatPassword) {
      this.user$ = this.userService.update(this.user).pipe(share());
      this.subscriptions.add(
        this.user$.pipe(tap(() => (this.app.user = this.user))).subscribe(() => {
          this.snackBar.open('Modifiche salvate', undefined, {
            duration: 3000,
          });
        }),
      );
    }
  }

  public togglePush(checked: boolean): void {
    if (checked) {
      this.pushService.subscribeToPush();
    } else {
      this.pushService.unsubscribeFromPush();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
