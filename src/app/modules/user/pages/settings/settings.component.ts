import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { share, tap } from 'rxjs/operators';

import { CredentialService, UserService } from '@app/http';
import { ApplicationService, PushService } from '@app/services';
import { User } from '@shared/models';

@Component({
  selector: 'fm-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  user$: Observable<User>;
  user: User;
  repeatPassword: string;
  push$: Observable<boolean>;
  enabled: boolean;

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
    this.enabled = this.pushService.isEnabled();
    this.push$ = this.pushService.isSubscribed();
  }

  save(): void {
    if (this.user?.password === this.repeatPassword) {
      this.user$ = this.userService.update(this.user)
        .pipe(share());
      this.user$.pipe(
        tap(() => this.app.user = this.user)
      )
        .subscribe(() => {
          this.snackBar.open('Modifiche salvate', undefined, {
            duration: 3000
          });
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
