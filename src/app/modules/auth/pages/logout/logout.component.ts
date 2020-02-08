import { Component } from '@angular/core';
import { AuthService } from '@app/core/services';

@Component({
  selector: 'fm-logout',
  template: ''
})
export class LogoutComponent {
  constructor(private readonly authService: AuthService) {
    this.authService.logout();
  }
}
