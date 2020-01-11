import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, ApplicationService, CredentialService } from '@app/core/services';
import { Observable } from 'rxjs';
import { CredentialRequestOptionsJSON } from '@github/webauthn-json';

@Component({
  selector: 'fm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginData: {
    email: string,
    password: string,
    remember_me: boolean
  } = { email: '', password: '', remember_me: true };
  loading = false;
  error = '';
  token: Observable<CredentialRequestOptionsJSON>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private credentialService: CredentialService,
    private app: ApplicationService
  ) {
  }

  ngOnInit() {

  }

  login() {
    this.loading = true;
    this.authService.login(this.loginData.email, this.loginData.password, this.loginData.remember_me).
      subscribe(result => this.postLogin(result));
  }

  tokenLogin(t: CredentialRequestOptionsJSON) {
    this.loading = true;
    this.authService.webauthnLogin(this.loginData.email, this.loginData.remember_me, t).subscribe((result: any) => this.postLogin(result));
  }

  checkToken() {
    this.token = this.credentialService.get(this.loginData.email);
  }

  postLogin(result: boolean): void {
    if (result === true) {
      const url =
        this.route.snapshot.queryParams.returnUrl ||
        '/championships/' + this.app.championship?.id;
      this.router.navigate([url]);
    } else {
      this.error = 'Username or password invalid';
      this.loading = false;
    }
  }
}
