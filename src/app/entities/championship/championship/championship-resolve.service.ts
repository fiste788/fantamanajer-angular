import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { SharedService } from '../../../shared/shared.service';
import { Championship } from '../championship';

@Injectable()
export class ChampionshipResolver implements Resolve<Championship> {
    constructor(private ss: SharedService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Championship {
        return this.ss.currentChampionship;
    }
}
