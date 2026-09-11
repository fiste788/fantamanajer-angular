import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';

import { firstValueFrom, switchMap } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { AppService } from '@app/services';
import type { Team } from '@data/interfaces';
import { TeamService } from '@data/services';
import type { TeamEditModal } from '@modules/team/components/modals/team-edit/team-edit.modal';
import { SrcsetPipe } from '@shared/pipes';

import { LayoutService } from '../../services';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIcon,
    MatOptionModule,
    MatRippleModule,
    MatSelectModule,
    MatToolbarModule,
    NgOptimizedImage,
    RouterLink,
    SrcsetPipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {

  readonly #dialog = inject(MatDialog);
  readonly #layoutService = inject(LayoutService);
  readonly #router = inject(Router);
  readonly #teamService = inject(TeamService);
  // Renamed injected services for clarity
  protected readonly applicationService = inject(AppService);
  protected readonly authenticationService = inject(AuthenticationService);

  public async change(team: Team): Promise<void> {
    await this.#router.navigateByUrl(`/teams/${team.id}`, {
      state: { team: await this.applicationService.changeTeam(team) }, // Updated service name
    });
    this.#layoutService.closeDrawer();
  }

  public compareFn(t1: Team, t2: Team): boolean {
    return t1.id === t2.id;
  }

  protected async openDialog(event: Event, teamId: number): Promise<boolean | undefined> {
    event.stopPropagation();
    this.#layoutService.closeDrawer();

    const { TeamEditModal } = await import('@modules/team/components/modals/team-edit/team-edit.modal');

    return firstValueFrom(
      this.#teamService.getTeamById(teamId).pipe(
        switchMap(team => this.#dialog
          .open<TeamEditModal, Team, boolean>(TeamEditModal, {
            data: team,
            scrollStrategy: new NoopScrollStrategy(),
          })
          .afterClosed()),
      ),
      { defaultValue: false },
    );
  }

}
