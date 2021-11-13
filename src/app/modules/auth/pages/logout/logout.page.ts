import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, switchMap } from 'rxjs';

import { AuthenticationService } from '@app/authentication';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutPage implements OnInit {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<boolean> {
    return firstValueFrom(
      this.authService.logout().pipe(switchMap(async () => this.router.navigate(['/']))),
    );
  }
}
