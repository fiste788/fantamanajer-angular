import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, map, share } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { PushService } from '@app/services';
import { UserService } from '@data/services';
import { User } from '@data/types';

@Component({
  styleUrl: './settings.page.scss',
  templateUrl: './settings.page.html',
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

  protected readonly user$ = this.#auth.requireUser$;
  protected readonly push$ = this.#pushService.isSubscribed();
  protected readonly enabled = this.#pushService.isEnabled();
  protected repeatPassword = '';

  protected async save(user: User): Promise<void> {
    if (user.password === this.repeatPassword) {
      return firstValueFrom(
        this.#userService.update(user).pipe(
          share(),
          map((res) => {
            this.#auth.user.set(res);
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
