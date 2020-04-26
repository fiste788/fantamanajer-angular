import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialRequestOptionsJSON } from '@github/webauthn-json';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { CredentialService } from '@app/http';
import { ApplicationService } from '@app/services';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [cardCreationAnimation]
})
export class LoginPage {
  loginData: {
    email: string,
    password: string,
    remember_me: boolean
  } = { email: '', password: '', remember_me: true };
  error = '';
  token$: Observable<CredentialRequestOptionsJSON>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly credentialService: CredentialService,
    private readonly app: ApplicationService
  ) {
  }

  login(): void {
    this.authService.login(this.loginData.email, this.loginData.password, this.loginData.remember_me)
      .subscribe(result => {
        this.postLogin(result);
      });
  }

  tokenLogin(t: CredentialRequestOptionsJSON): void {
    this.authService.webauthnLogin(this.loginData.email, this.loginData.remember_me, t)
      .subscribe(result => {
        this.postLogin(result);
      });
  }

  checkToken(): void {
    this.token$ = this.credentialService.get(this.loginData.email);
  }

  postLogin(result: boolean): void {
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
