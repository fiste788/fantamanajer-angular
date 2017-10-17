import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'fm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginData: any = {};
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService) {
    this.loginData.remember_me = true;
  }

  ngOnInit() {
    // reset login status
    // this.authService.logout();
  }

  login() {
    this.loading = true;
    this.authService.login(this.loginData.email, this.loginData.password)
      .subscribe(result => {
        if (result === true) {
          const url = this.route.snapshot.queryParams['returnUrl'] || '/championships/' + this.sharedService.currentChampionship.id;
          this.router.navigate([url]);
        } else {
          this.error = 'Username or password is incorrect';
          this.loading = false;
        }
      });
  }

}
