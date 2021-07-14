import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { map, Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly auth: AuthenticationService) {}

  public canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.userChange$.pipe(map((user) => user?.admin || false));
  }
}
