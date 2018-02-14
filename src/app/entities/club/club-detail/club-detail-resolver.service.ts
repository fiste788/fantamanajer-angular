import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Club } from '../club';
import { ClubService } from '../club.service';

@Injectable()
export class ClubDetailResolver implements Resolve<Club> {
    constructor(private cs: ClubService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Club> {
        const id = parseInt(route.paramMap.get('id'), 10);

        return this.cs.getClub(id);
    }
}
