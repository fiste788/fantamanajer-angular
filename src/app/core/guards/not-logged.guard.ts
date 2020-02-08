import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services';

@Injectable()
export class NotLoggedGuard implements CanActivate {

  constructor(private readonly auth: AuthService, private readonly router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.auth.loggedIn()) {
      return true;
    }
    void this.router.navigate(['/home']);

    return false;

  }
}
