import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../user.service';
import { User } from '../user';
import 'rxjs/add/operator/share';

@Component({
  selector: 'fm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userObservable: Observable<User>;
  user: User;
  repeat_password: String;

  constructor(
    public snackBar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = Object.assign({}, this.authService.user);
  }

  save() {
    if (this.user.password === this.repeat_password) {
      this.userObservable = this.userService.update(this.user).share();
      this.userObservable.subscribe(response => {
        this.snackBar.open('Modifiche salvate', null, {
          duration: 3000
        });
        this.authService.user = this.user;
        localStorage.setItem('currentUser', JSON.stringify(this.user));
      });
    }
  }
}
