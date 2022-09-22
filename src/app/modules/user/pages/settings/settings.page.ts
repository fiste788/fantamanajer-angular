import { Component, HostBinding } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { firstValueFrom, Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { PushService } from '@app/services';
import { UserService } from '@data/services';
import { User } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./settings.page.scss'],
  templateUrl: './settings.page.html',
})
export class SettingsPage {
  @HostBinding('@cardCreationAnimation') public a = '';

  protected readonly user$: Observable<User>;
  protected readonly push$: Observable<boolean>;
  protected readonly enabled: boolean;
  protected repeatPassword: string;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly auth: AuthenticationService,
    private readonly userService: UserService,
    private readonly pushService: PushService,
  ) {
    this.user$ = this.auth.requireUser$;
    this.repeatPassword = '';
    this.enabled = this.pushService.isEnabled();
    this.push$ = this.pushService.isSubscribed();
  }

  protected async save(user: User): Promise<void> {
    if (user.password === this.repeatPassword) {
      return firstValueFrom(
        this.userService.update(user).pipe(
          share(),
          map((res) => {
            this.auth.userSubject.next(res);
            this.snackBar.open('Modifiche salvate');
          }),
        ),
        { defaultValue: undefined },
      );
    }

    return undefined;
  }

  protected async togglePush(user: User, checked: boolean): Promise<void> {
    return firstValueFrom(
      checked ? this.pushService.subscribeToPush(user) : this.pushService.unsubscribeFromPush(),
      { defaultValue: undefined },
    );
  }
}
