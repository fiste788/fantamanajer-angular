import { Component } from '@angular/core';
import { AuthenticationService } from '@app/core/authentication';

@Component({
  selector: 'fm-logout',
  template: ''
})
export class LogoutComponent {
  constructor(private readonly authService: AuthenticationService) {
    this.authService.logout();
  }
}
