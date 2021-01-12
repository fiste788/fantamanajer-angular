import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

import { ApplicationService } from '@app/services';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly app: ApplicationService) {}

  public canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.app.user?.admin || false;
  }
}
