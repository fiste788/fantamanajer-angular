import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, ApplicationService } from '@app/core/services';

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
  } = { email: '', password: '', remember_me: false };
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private app: ApplicationService
  ) {
    this.loginData.remember_me = true;
  }

  ngOnInit() {
    // reset login status
    // this.authService.logout();
  }

  login() {
    this.loading = true;
    this.authService
      .login(
        this.loginData.email,
        this.loginData.password,
        this.loginData.remember_me
      )
      .subscribe(result => {
        if (result === true) {
          const url =
            this.route.snapshot.queryParams['returnUrl'] ||
            '/championships/' + this.app.championship.id;
          this.router.navigate([url]);
        } else {
          this.error = 'Username or password invalid';
          this.loading = false;
        }
      });
  }

  tokenLogin() {
    this.authService.tokenLogin(this.loginData.email);
    return false;
  }
}
