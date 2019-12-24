import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, from } from 'rxjs';
import { share, take } from 'rxjs/operators';
import { ApplicationService, PushService, UserService } from '@app/core/services';
import { User } from '@app/core/models';
import { CredentialService } from '@app/core/services/credential.service';

@Component({
  selector: 'fm-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userObservable: Observable<User>;
  user: User;
  repeatPassword: string;
  push: boolean;

  constructor(
    public snackBar: MatSnackBar,
    private app: ApplicationService,
    private userService: UserService,
    private pushService: PushService,
    private credentialService: CredentialService
  ) { }

  ngOnInit() {
    this.user = Object.assign({}, this.app.user);
    this.pushService.swPush.subscription
      .pipe(take(1))
      .subscribe(() => (this.push = true));
    // this.push = this.pushService.isSubscribed();
  }

  save() {
    if (this.user.password === this.repeatPassword) {
      this.userObservable = this.userService.update(this.user).pipe(share());
      this.userObservable.subscribe(response => {
        this.snackBar.open('Modifiche salvate', undefined, {
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

  registerDevice() {
    this.credentialService.createPublicKey().subscribe(console.log);
  }
}