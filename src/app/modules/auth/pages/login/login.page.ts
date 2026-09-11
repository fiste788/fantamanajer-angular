import { ChangeDetectorRef, Component, inject, viewChild } from '@angular/core';
import type { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import type { MatStepper } from '@angular/material/stepper';
import { MatStepperModule } from '@angular/material/stepper';

import { firstValueFrom } from 'rxjs';

import { AuthenticationService } from '@app/authentication';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatStepperModule,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {

  readonly #authService = inject(AuthenticationService);
  readonly #cd = inject(ChangeDetectorRef);

  protected loginData: {
    email?: string;
    password?: string;
  } = {};

  protected readonly form = viewChild<NgForm>('f');
  protected readonly stepper = viewChild.required<MatStepper>('stepper');

  constructor() {
    void this.#authService.authenticatePasskey();
  }

  protected async login(form?: NgForm): Promise<boolean> {
    if (this.loginData.email && this.loginData.password) {
      try {
        const isResult = await firstValueFrom(
          this.#authService.authenticate(this.loginData.email, this.loginData.password),
          { defaultValue: false },
        );

        if (!isResult) {
          this.showError(form);
        }

        return isResult;
      } catch {
        return false;
      }
    }

    return false;
  }

  protected reset(form?: NgForm): void {
    this.form()?.reset();
    form?.resetForm();
    this.stepper().reset();
  }

  protected showError(form?: NgForm): void {
    if (!form) {
      return;
    }

    const { password } = form.controls;
    password?.setErrors({ msg: 'Authentication failed' });
    this.#cd.detectChanges();
  }

}
