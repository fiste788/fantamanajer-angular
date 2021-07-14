import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '@app/authentication';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutPage implements OnInit {
  constructor(private readonly authService: AuthenticationService) {}

  async ngOnInit(): Promise<Record<string, never>> {
    return firstValueFrom(this.authService.logout());
  }
}
