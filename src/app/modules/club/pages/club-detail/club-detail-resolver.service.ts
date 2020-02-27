import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ClubService } from '@app/core/http';
import { Club } from '@app/shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class ClubDetailResolver implements Resolve<Club | undefined> {
  constructor(private readonly cs: ClubService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Club> | undefined {
    const clubId = route.paramMap.get('id');
    if (clubId !== null) {
      const id = parseInt(clubId, 10);

      return this.cs.getClub(id);
    }

    return undefined;
  }
}
