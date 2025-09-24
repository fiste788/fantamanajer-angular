import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { NgOptimizedImage } from '@angular/common';
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
import { firstValueFrom, switchMap } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { TeamService } from '@data/services';
import { Team } from '@data/types';
import { type TeamEditModal } from '@modules/team/modals/team-edit/team-edit.modal';
import { SrcsetPipe } from '@shared/pipes';

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
    MatIcon,
    MatButtonModule,
    NgOptimizedImage,
    SrcsetPipe,
  ],
})
export class ProfileComponent {
  readonly #router = inject(Router);
  readonly #layoutService = inject(LayoutService);
  readonly #dialog = inject(MatDialog);
  readonly #teamService = inject(TeamService);

  // Renamed injected services for clarity
  protected readonly applicationService = inject(ApplicationService);
  protected readonly authenticationService = inject(AuthenticationService);

  public async change(team: Team): Promise<void> {
    void this.#router.navigateByUrl(`/teams/${team.id}`, {
      state: { team: await this.applicationService.changeTeam(team) }, // Updated service name
    });
    this.#layoutService.closeDrawer();
  }

  public compareFn(t1: Team, t2: Team): boolean {
    return t1.id === t2.id;
  }

  protected async openDialog(event: Event, team_id: number): Promise<boolean | undefined> {
    event.stopPropagation();
    this.#layoutService.closeDrawer();

    const { TeamEditModal } = await import('@modules/team/modals/team-edit/team-edit.modal');

    return firstValueFrom(
      this.#teamService.getTeamById(team_id).pipe(
        switchMap((team) =>
          this.#dialog
            .open<TeamEditModal, Team, boolean>(TeamEditModal, {
              data: team,
              scrollStrategy: new NoopScrollStrategy(),
            })
            .afterClosed(),
        ),
      ),
      { defaultValue: false },
    );
  }
}
