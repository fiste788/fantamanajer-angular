import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { ClubService } from '@data/services';
import { Club } from '@data/types';

@Injectable()
export class ClubDetailResolver implements Resolve<Club | undefined> {
  constructor(private readonly cs: ClubService) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<Club> | undefined {
    const clubId = route.paramMap.get('id');
    if (clubId !== null) {
      const id = +clubId;

      return this.cs.getClub(id);
    }

    return undefined;
  }
}
