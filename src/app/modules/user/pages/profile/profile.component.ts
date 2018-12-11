import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { share, take } from 'rxjs/operators';
import { ApplicationService, PushService, UserService } from '@app/core/services';
import { User } from '@app/core/models';

@Component({
  selector: 'fm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userObservable: Observable<User>;
  user: User;
  repeat_password: String;
  push: boolean;

  constructor(
    public snackBar: MatSnackBar,
    private app: ApplicationService,
    private userService: UserService,
    private pushService: PushService
  ) { }

  ngOnInit() {
    this.user = Object.assign({}, this.app.user);
    this.pushService.swPush.subscription
      .pipe(take(1))
      .subscribe(() => (this.push = true));
    // this.push = this.pushService.isSubscribed();
  }

  save() {
    if (this.user.password === this.repeat_password) {
      this.userObservable = this.userService.update(this.user).pipe(share());
      this.userObservable.subscribe(response => {
        this.snackBar.open('Modifiche salvate', null, {
          duration: 3000
        });
        this.app.user = this.user;
      });
    }
  }

  togglePush() {
    if (this.push) {
      this.pushService.subscribeToPush();
    } else {
      this.pushService.unsubscribeFromPush();
    }
  }
}
