import { ChangeDetectorRef, Component, viewChild, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { firstValueFrom } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { addVisibleClassOnDestroy } from '@app/functions';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  animations: [cardCreationAnimation],
  styleUrl: './login.page.scss',
  templateUrl: './login.page.html',
  imports: [
    MatCardModule,
    MatIconModule,
    MatStepperModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
})
export class LoginPage {
  readonly #authService = inject(AuthenticationService);
  readonly #cd = inject(ChangeDetectorRef);

  protected readonly stepper = viewChild.required<MatStepper>('stepper');
  protected readonly form = viewChild<NgForm>('f');
  protected loginData: {
    email?: string;
    password?: string;
  } = {};

  constructor() {
    addVisibleClassOnDestroy(cardCreationAnimation);
    void this.#authService.authenticatePasskey();
  }

  protected async login(form?: NgForm): Promise<boolean> {
    if (this.loginData.email && this.loginData.password) {
      try {
        const result = await firstValueFrom(
          this.#authService.authenticate(this.loginData.email, this.loginData.password),
          { defaultValue: false },
        );

        if (!result) {
          this.showError(form);
        }

        return result;
      } catch {
        return false;
      }
    }

    return false;
  }

  protected showError(form?: NgForm): void {
    if (form) {
      const { password } = form.controls;
      password?.setErrors({ msg: 'Authentication failed' });
      this.#cd.detectChanges();
    }
  }

  protected reset(form?: NgForm): void {
    this.form()?.reset();
    form?.resetForm();
    this.stepper().reset();
  }
}
