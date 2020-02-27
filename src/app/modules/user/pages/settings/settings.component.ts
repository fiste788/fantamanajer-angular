import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CredentialService, UserService } from '@app/core/http';
import { User } from '@app/core/models';
import { ApplicationService, PushService } from '@app/core/services';
import { from, Observable } from 'rxjs';
import { share, take } from 'rxjs/operators';

@Component({
  selector: 'fm-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userObservable: Observable<User>;
  user: User;
  repeatPassword: string;
  push: Observable<boolean>;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly app: ApplicationService,
    private readonly userService: UserService,
    private readonly pushService: PushService,
    private readonly credentialService: CredentialService
  ) { }

  ngOnInit(): void {
    if (this.app.user) {
      this.user = this.app.user;
    }
    this.push = this.pushService.isSubscribed();
  }

  save(): void {
    if (this.user?.password === this.repeatPassword) {
      this.userObservable = this.userService.update(this.user)
        .pipe(share());
      this.userObservable.subscribe(response => {
        this.snackBar.open('Modifiche salvate', undefined, {
          duration: 3000
        });
        this.app.user = this.user;
      });
    }
  }

  togglePush(checked: boolean): void {
    if (checked) {
      this.pushService.subscribeToPush();
    } else {
      this.pushService.unsubscribeFromPush();
    }
  }

  registerDevice(): void {
    this.credentialService.createPublicKey()
      .subscribe();
  }
}
