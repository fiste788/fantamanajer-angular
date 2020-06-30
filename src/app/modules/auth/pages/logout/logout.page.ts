import { Component } from '@angular/core';

import { AuthenticationService } from '@app/authentication';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutPage {
  constructor(private readonly authService: AuthenticationService) {
    this.authService.logout();
  }
}
