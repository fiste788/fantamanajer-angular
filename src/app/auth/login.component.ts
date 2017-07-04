import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'fm-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService) { }

  ngOnInit() {
    // reset login status
    this.authService.logout();
  }

  login() {
    this.loading = true;
    this.authService.login(this.model.email, this.model.password)
      .subscribe(result => {
        if (result === true) {
          console.log('user logged');
          this.router.navigate(['/championships/' + this.sharedService.currentChampionship.id]);
        } else {
          this.error = 'Username or password is incorrect';
          this.loading = false;
        }
      });
    }

}
