import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialRequestOptionsJSON } from '@github/webauthn-json';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, map, share } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { WebauthnService } from '@data/services';
import { ApplicationService } from '@app/services';
import { cardCreationAnimation } from '@shared/animations';
import { NgForm } from '@angular/forms';
import { Team } from '@data/types';

@Component({
  animations: [cardCreationAnimation],
  selector: 'app-login',
  styleUrls: ['./login.page.scss'],
  templateUrl: './login.page.html',
})
export class LoginPage {
  @ViewChild('stepper') private readonly stepper: MatStepper;
  @ViewChild('f') private readonly form: NgForm;
  public loginData: {
    email?: string;
    password?: string;
    rememberMe: boolean;
  } = { rememberMe: true };
  public token$: Observable<CredentialRequestOptionsJSON>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly webauthnService: WebauthnService,
    private readonly app: ApplicationService,
    private readonly cd: ChangeDetectorRef,
  ) {}

  public async login(): Promise<boolean> {
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

  public async tokenLogin(t: CredentialRequestOptionsJSON): Promise<boolean> {
    if (this.loginData.email) {
      return firstValueFrom(
        this.authService.webauthnLogin(this.loginData.email, this.loginData.rememberMe, t).pipe(
          catchError(() => of(false)),
          map(async (result) => this.postLogin(result)),
        ),
        { defaultValue: false },
      );
    }
    return false;
  }

  public async checkToken(): Promise<void> {
    if (this.loginData.email) {
      this.token$ = this.webauthnService.get(this.loginData.email).pipe(share());
      return firstValueFrom(
        this.token$.pipe(
          map((t) => {
            void this.tokenLogin(t);
            this.stepper.next();
          }),
          //takeUntil(this.authService.loggedIn$),
        ),
        { defaultValue: undefined },
      );
    }
  }

  public async postLogin(result: boolean): Promise<boolean> {
    if (result) {
      return firstValueFrom(
        this.app.requireTeam$.pipe(
          map((t) => this.getUrl(t)),
          map(async (url) => this.router.navigateByUrl(url)),
        ),
      );
    } else {
      const password = this.form.controls['password'];
      password.setErrors({ msg: 'Authentication failed' });
      this.cd.detectChanges();
      return false;
    }
  }

  private getUrl(team: Team): string {
    return (
      (this.route.snapshot.queryParams.returnUrl as string | undefined) ??
      `/championships/${team.championship?.id ?? 0}`
    );
  }
}
