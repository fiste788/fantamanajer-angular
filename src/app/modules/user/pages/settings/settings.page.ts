import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';

import { firstValueFrom } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { save } from '@app/functions';
import { PushService } from '@app/services';
import type { User } from '@data/interfaces';
import { UserService } from '@data/services';

@Component({
  imports: [AsyncPipe, FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
})
export class SettingsPage {

  readonly #auth = inject(AuthenticationService);
  readonly #pushService = inject(PushService);
  readonly #snackBar = inject(MatSnackBar);
  readonly #userService = inject(UserService);

  protected repeatPassword = '';

  protected readonly enabled = this.#pushService.isEnabled();
  protected readonly push$ = this.#pushService.isSubscribed();
  protected readonly user = this.#auth.currentUser;

  protected async save(user: User): Promise<boolean> {
    if (user.password === this.repeatPassword) {
      return save(this.#userService.updateUser(user), false, this.#snackBar, {
        callback: () => this.#auth.reloadCurrentUser(),
        message: 'Modifiche salvate',
      });
    }

    return false;
  }

  protected async togglePush(user: User, isChecked: boolean): Promise<void> {
    return firstValueFrom(isChecked ? this.#pushService.subscribeToPush(user) : this.#pushService.unsubscribeFromPush(), { defaultValue: undefined });
  }

}
