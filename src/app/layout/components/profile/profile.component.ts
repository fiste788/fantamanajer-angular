import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { firstValueFrom, forkJoin, map, Observable, switchMap } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { TeamService } from '@data/services';
import { Team } from '@data/types';
import { TeamEditModalData } from '@modules/team/modals/team-edit/team-edit.modal';

import { LayoutService } from '../../services';

@Component({
  selector: 'app-profile',
  styleUrl: './profile.component.scss',
  templateUrl: './profile.component.html',
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    AsyncPipe,
    MatIcon,
    MatButtonModule,
    NgOptimizedImage,
  ],
})
export class ProfileComponent {
  readonly #router = inject(Router);
  readonly #layoutService = inject(LayoutService);
  readonly #dialog = inject(MatDialog);
  readonly #teamService = inject(TeamService);

  protected readonly app = inject(ApplicationService);
  protected readonly auth = inject(AuthenticationService);
  protected readonly photo$ = this.#loadPhoto();

  public async change(team: Team): Promise<void> {
    void this.#router.navigateByUrl(`/teams/${team.id}`, {
      state: { team: await this.app.changeTeam(team) },
    });
    this.#layoutService.closeSidebar();
  }

  public compareFn(t1: Team, t2: Team): boolean {
    return t1.id === t2.id;
  }

  protected async openDialog(event: Event, team: Team): Promise<boolean | undefined> {
    event.stopPropagation();

    const { TeamEditModal } = await import('@modules/team/modals/team-edit/team-edit.modal');

    return firstValueFrom(
      forkJoin([
        firstValueFrom(this.app.matchday$, { defaultValue: undefined }),
        this.#teamService.getTeam(team.id),
      ]).pipe(
        switchMap(([m, t]) =>
          this.#dialog
            .open<unknown, TeamEditModalData, boolean>(TeamEditModal, {
              data: { team: t, showChangeTeamName: (m?.number ?? 0) <= 38 },
            })
            .afterClosed(),
        ),
      ),
      { defaultValue: false },
    );
  }

  #loadPhoto(): Observable<string | undefined> {
    return this.app.requireTeam$.pipe(
      map((team) => (team.photo_url ? team.photo_url['240w'] : undefined)),
    );
  }
}
