import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService, LayoutService } from '@app/services';
import { Team } from '@data/types';

@Component({
  selector: 'app-profile',
  styleUrls: ['./profile.component.scss'],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  public photo$: Observable<string | undefined>;

  constructor(
    public app: ApplicationService,
    private readonly router: Router,
    public readonly auth: AuthenticationService,
    private readonly layoutService: LayoutService,
  ) {
    this.photo$ = this.loadPhoto();
  }

  public change(team: Team): void {
    this.app.teamSubject$.next(team);
    void this.router.navigateByUrl(`/teams/${team.id}`);
    this.layoutService.closeSidebar();
  }

  public compareFn(t1: Team, t2: Team): boolean {
    return t1.id === t2.id;
  }

  public track(_: number, team: Team): number {
    return team.id;
  }

  private loadPhoto(): Observable<string | undefined> {
    return this.app.requireTeam$.pipe(
      map((team) => (team.photo_url ? team.photo_url['240w'] : undefined)),
    );
  }
}
