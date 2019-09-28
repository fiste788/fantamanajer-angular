import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Championship } from '@app/core/models';
import { ApplicationService } from '@app/core/services';

@Injectable()
export class ChampionshipResolver implements Resolve<Championship> {
    constructor(private app: ApplicationService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Championship> | Championship {
        return this.app.championship;
    }
}
