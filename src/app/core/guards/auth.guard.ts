import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, ApplicationService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private app: ApplicationService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.loggedIn()) {
      const authorities = next.data.authorities;
      if (!authorities || authorities.length === 0) {
        return true;
      }
      return this.checkLogin(authorities, state.url);
    } else {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }

  checkLogin(authorities: string[], url: string): boolean {
    for (const a in authorities) {
      if (this.app.user?.roles.includes(authorities[a])) {
        return true;
      }
    }
    return false;
  }
}
