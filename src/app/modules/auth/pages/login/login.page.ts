import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialRequestOptionsJSON } from '@github/webauthn-json';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { CredentialService } from '@app/http';
import { ApplicationService } from '@app/services';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  animations: [cardCreationAnimation],
  selector: 'app-login',
  styleUrls: ['./login.page.scss'],
  templateUrl: './login.page.html',
})
export class LoginPage {
  public loginData: {
    email?: string,
    password?: string,
    remember_me: boolean,
  } = { remember_me: true };
  public error = '';
  public token$: Observable<CredentialRequestOptionsJSON>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly credentialService: CredentialService,
    private readonly app: ApplicationService,
  ) {
  }

  public login(): void {
    if (this.loginData.email && this.loginData.password) {
      this.authService.login(this.loginData.email, this.loginData.password, this.loginData.remember_me)
        .subscribe((result) => {
          this.postLogin(result);
        });
    }
  }

  public tokenLogin(t: CredentialRequestOptionsJSON): void {
    if (this.loginData.email) {
      this.authService.webauthnLogin(this.loginData.email, this.loginData.remember_me, t)
        .subscribe((result) => {
          this.postLogin(result);
        });
    }
  }

  public checkToken(): void {
    if (this.loginData.email) {
      this.token$ = this.credentialService.get(this.loginData.email);
    }
  }

  public postLogin(result: boolean): void {
    if (result) {
      const url =
        this.route.snapshot.queryParams.returnUrl ||
        `/championships/${this.app.championship?.id}`;
      void this.router.navigate([url]);
    } else {
      this.error = 'Username or password invalid';
    }
  }
}
