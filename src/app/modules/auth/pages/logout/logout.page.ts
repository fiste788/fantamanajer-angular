import { Component, OnDestroy } from '@angular/core';

import { AuthenticationService } from '@app/authentication';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutPage implements OnDestroy {
  private readonly subscriptions = new Subscription();

  constructor(private readonly authService: AuthenticationService) {
    this.subscriptions.add(this.authService.logout().subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
