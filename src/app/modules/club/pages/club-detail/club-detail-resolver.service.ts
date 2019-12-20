import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Club } from '@app/core/models';
import { ClubService } from '@app/core/services';

@Injectable()
export class ClubDetailResolver implements Resolve<Club | undefined> {
  constructor(private cs: ClubService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Club> | undefined {
    const clubId = route.paramMap.get('id');
    if (clubId) {
      const id = parseInt(clubId, 10);

      return this.cs.getClub(id);
    }
    return undefined;
  }
}
