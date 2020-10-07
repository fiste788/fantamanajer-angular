import { Component, HostBinding, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { share, tap } from 'rxjs/operators';

import { UserService } from '@app/http';
import { ApplicationService, PushService } from '@app/services';
import { cardCreationAnimation } from '@shared/animations';
import { User } from '@shared/models';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./settings.page.scss'],
  templateUrl: './settings.page.html',
})
export class SettingsPage implements OnInit {
  @HostBinding('@cardCreationAnimation') public a = '';

  public user$: Observable<User>;
  public user: User;
  public repeatPassword: string;
  public push$: Observable<boolean>;
  public enabled: boolean;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly app: ApplicationService,
    private readonly userService: UserService,
    private readonly pushService: PushService,
  ) { }

  public ngOnInit(): void {
    if (this.app.user) {
      this.user = this.app.user;
    }
    this.enabled = this.pushService.isEnabled();
    this.push$ = this.pushService.isSubscribed();
  }

  public save(): void {
    if (this.user?.password === this.repeatPassword) {
      this.user$ = this.userService.update(this.user)
        .pipe(share());
      this.user$.pipe(
        tap(() => this.app.user = this.user),
      )
        .subscribe(() => {
          this.snackBar.open('Modifiche salvate', undefined, {
            duration: 3000,
          });
        });
    }
  }

  public togglePush(checked: boolean): void {
    if (checked) {
      this.pushService.subscribeToPush();
    } else {
      this.pushService.unsubscribeFromPush();
    }
  }
}
