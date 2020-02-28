import { Component } from '@angular/core';
import { AuthenticationService } from '@app/authentication';

@Component({
  selector: 'fm-logout',
  template: ''
})
export class LogoutComponent {
  constructor(private readonly authService: AuthenticationService) {
    this.authService.logout();
  }
}
