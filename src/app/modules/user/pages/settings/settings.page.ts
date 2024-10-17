import { AsyncPipe } from '@angular/common';
import { Component, HostBinding, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { addVisibleClassOnDestroy } from '@app/functions';
import { PushService } from '@app/services';
import { UserService } from '@data/services';
import { User } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  animations: [cardCreationAnimation],
  styleUrl: './settings.page.scss',
  templateUrl: './settings.page.html',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    AsyncPipe,
  ],
})
export class SettingsPage {
  readonly #snackBar = inject(MatSnackBar);
  readonly #auth = inject(AuthenticationService);
  readonly #userService = inject(UserService);
  readonly #pushService = inject(PushService);

  @HostBinding('@cardCreationAnimation')
  public a = '';

  protected readonly user$ = this.#auth.requireUser$;
  protected readonly push$ = this.#pushService.isSubscribed();
  protected readonly enabled = this.#pushService.isEnabled();
  protected repeatPassword = '';

  constructor() {
    addVisibleClassOnDestroy(cardCreationAnimation);
  }

  protected async save(user: User): Promise<void> {
    if (user.password === this.repeatPassword) {
      return firstValueFrom(
        this.#userService.update(user).pipe(
          share(),
          map((res) => {
            this.#auth.userSubject.next(res);
            this.#snackBar.open('Modifiche salvate');
          }),
        ),
        { defaultValue: undefined },
      );
    }

    return undefined;
  }

  protected async togglePush(user: User, checked: boolean): Promise<void> {
    return firstValueFrom(
      checked ? this.#pushService.subscribeToPush(user) : this.#pushService.unsubscribeFromPush(),
      { defaultValue: undefined },
    );
  }
}
