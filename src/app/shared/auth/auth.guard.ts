import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApplicationService } from 'app/core/application.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private app: ApplicationService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.loggedIn()) {
      const authorities = next.data['authorities'];
      if (!authorities || authorities.length === 0) {
        return true;
      }
      return this.checkLogin(authorities, state.url);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }

  checkLogin(authorities: string[], url: string): boolean {
    for (let i = 0; i < authorities.length; i++) {
      if (this.app.user.roles.includes(authorities[i])) {
        return true;
      }
    }
    return false;
  }
}
