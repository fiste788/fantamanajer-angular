import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { Team } from '@data/types';

import { LayoutService } from '../../services';

@Component({
  selector: 'app-profile',
  styleUrls: ['./profile.component.scss'],
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    NgIf,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    NgFor,
    MatOptionModule,
    AsyncPipe,
  ],
})
export class ProfileComponent {
  protected readonly photo$: Observable<string | undefined>;

  constructor(
    protected readonly app: ApplicationService,
    protected readonly auth: AuthenticationService,
    private readonly router: Router,
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
