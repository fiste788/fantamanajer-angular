import { NgIf, NgFor, AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { first, firstValueFrom, map, Observable, switchMap } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { Team } from '@data/types';
import { TeamEditModalData } from '@modules/team/modals/team-edit/team-edit.modal';

import { LayoutService } from '../../services';

@Component({
  selector: 'app-profile[sidenav]',
  styleUrl: './profile.component.scss',
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
    MatIcon,
    MatButtonModule,
    NgOptimizedImage,
  ],
})
export class ProfileComponent {
  public sidenav = input.required<MatSidenav>();
  protected readonly photo$: Observable<string | undefined>;

  constructor(
    protected readonly app: ApplicationService,
    protected readonly auth: AuthenticationService,
    private readonly router: Router,
    private readonly layoutService: LayoutService,
    private readonly dialog: MatDialog,
  ) {
    this.photo$ = this.loadPhoto();
  }

  public change(team: Team): void {
    this.app.teamSubject$.next(team);
    void this.router.navigateByUrl(`/teams/${team.id}`);
    if (this.sidenav().mode === 'over') {
      this.layoutService.closeSidebar();
    }
  }

  public compareFn(t1: Team, t2: Team): boolean {
    return t1.id === t2.id;
  }

  protected async openDialog(event: Event, team: Team): Promise<boolean | undefined> {
    event.stopPropagation();

    const { TeamEditModal } = await import('@modules/team/modals/team-edit/team-edit.modal');

    return firstValueFrom(
      this.app.matchday$.pipe(
        first(),
        switchMap((m) =>
          this.dialog
            .open<unknown, TeamEditModalData, boolean>(TeamEditModal, {
              data: { team, showChangeTeamName: m.number <= 38 },
            })
            .afterClosed(),
        ),
      ),
      { defaultValue: false },
    );
  }

  private loadPhoto(): Observable<string | undefined> {
    return this.app.requireTeam$.pipe(
      map((team) => (team.photo_url ? team.photo_url['240w'] : undefined)),
    );
  }
}
