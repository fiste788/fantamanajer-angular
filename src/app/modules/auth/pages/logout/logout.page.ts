import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '@app/authentication';

@Component({
  template: '',
  standalone: true,
})
export class LogoutPage implements OnInit {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly router: Router,
  ) {}

  public async ngOnInit(): Promise<boolean> {
    await this.authService.logout();

    return this.router.navigate(['/']);
  }
}
