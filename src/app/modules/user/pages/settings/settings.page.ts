import { Component, HostBinding, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Observable } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';

import { UserService } from '@data/services';
import { PushService } from '@app/services';
import { cardCreationAnimation } from '@shared/animations';
import { User } from '@data/types';
import { AuthenticationService } from '@app/authentication';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./settings.page.scss'],
  templateUrl: './settings.page.html',
})
export class SettingsPage implements OnInit {
  @HostBinding('@cardCreationAnimation') public a = '';

  public user$: Observable<User>;
  public repeatPassword: string;
  public push$: Observable<boolean>;
  public enabled: boolean;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly auth: AuthenticationService,
    private readonly userService: UserService,
    private readonly pushService: PushService,
  ) {}

  public ngOnInit(): void {
    this.user$ = this.auth.userChange$.pipe(filter((user): user is User => user !== undefined));
    this.enabled = this.pushService.isEnabled();
    this.push$ = this.pushService.isSubscribed();
  }

  public async save(user: User): Promise<void> {
    if (user?.password === this.repeatPassword) {
      return firstValueFrom(
        this.userService.update(user).pipe(
          share(),
          map((res) => {
            this.auth.userSubject.next(res);
            this.snackBar.open('Modifiche salvate', undefined, {
              duration: 3000,
            });
          }),
        ),
      );
    }
  }

  public togglePush(user: User, checked: boolean): void {
    if (checked) {
      this.pushService.subscribeToPush(user);
    } else {
      this.pushService.unsubscribeFromPush();
    }
  }
}
