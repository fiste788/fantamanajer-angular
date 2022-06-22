import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { Team } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./login.page.scss'],
  templateUrl: './login.page.html',
})
export class LoginPage {
  @ViewChild('stepper') protected readonly stepper?: MatStepper;
  @ViewChild('f') protected readonly form?: NgForm;
  @ViewChild('userForm') protected readonly userForm?: NgForm;
  protected loginData: {
    email?: string;
    password?: string;
    rememberMe: boolean;
  } = { rememberMe: true };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly app: ApplicationService,
    private readonly cd: ChangeDetectorRef,
  ) {}

  protected async login(): Promise<boolean> {
    if (this.loginData.email && this.loginData.password) {
      return firstValueFrom(
        this.authService
          .login(this.loginData.email, this.loginData.password, this.loginData.rememberMe)
          .pipe(
            catchError(() => of(false)),
            map(async (result) => this.postLogin(result)),
          ),
        { defaultValue: false },
      );
    }
    return false;
  }

  protected async checkToken(): Promise<boolean> {
    return firstValueFrom(
      this.authService.tryTokenLogin(this.loginData.email).pipe(
        switchMap((res) => {
          if (!res) {
            this.stepper?.next();
            return of(false);
          } else {
            return this.postLogin(res);
          }
        }),
      ),
      { defaultValue: false },
    );
  }

  protected async postLogin(result: boolean): Promise<boolean> {
    if (result) {
      return firstValueFrom(
        this.app.requireTeam$.pipe(
          map((t) => this.getUrl(t)),
          map(async (url) => this.router.navigateByUrl(url)),
        ),
        { defaultValue: false },
      );
    } else if (this.form) {
      const password = this.form.controls['password'];
      password.setErrors({ msg: 'Authentication failed' });
      this.cd.detectChanges();
      return false;
    }

    return false;
  }

  protected reset(): void {
    this.form?.reset();
    this.userForm?.resetForm();
    this.stepper?.reset();
  }

  private getUrl(team: Team): string {
    return (
      (this.route.snapshot.queryParams['returnUrl'] as string | undefined) ??
      `/championships/${team.championship?.id ?? 0}`
    );
  }
}
