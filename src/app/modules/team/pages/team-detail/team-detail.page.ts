import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, afterNextRender, input, inject, linkedSignal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService, ScrollService } from '@app/services';
import { Tab, Team, User } from '@data/types';
import { ParallaxHeaderComponent } from '@shared/components/parallax-header';
import { PrimaryTabComponent } from '@shared/components/primary-tab/primary-tab.component';

import { TeamEditModal, TeamEditModalData } from '../../modals/team-edit/team-edit.modal';

@Component({
  styleUrl: './team-detail.page.scss',
  templateUrl: './team-detail.page.html',
  imports: [
    ParallaxHeaderComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    PrimaryTabComponent,
  ],
})
export class TeamDetailPage implements OnInit {
  readonly #scrollService = inject(ScrollService);
  readonly #dialog = inject(MatDialog);

  protected team = input.required<Team>();
  protected placeholder?: string;

  protected readonly app = inject(ApplicationService);
  protected readonly auth = inject(AuthenticationService);

  protected tabs = linkedSignal(() => {
    return this.loadTabs(
      this.team(),
      this.app.seasonEnded(),
      this.app.currentTeam(),
      this.auth.currentUser(),
    );
  });

  constructor() {
    afterNextRender(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.placeholder = history.state?.img as string | undefined;
    });
  }

  public ngOnInit(): void {
    if (
      this.team().championship.season_id != this.app.currentMatchday()?.season_id &&
      this.team().user_id === this.auth.currentUser()?.id
    ) {
      void this.app.changeTeam(this.team());
    }
  }

  public loadTabs(currentTeam: Team, seasonEnded = false, team?: Team, user?: User): Array<Tab> {
    const { started } = currentTeam.championship;

    return [
      { label: 'Giocatori', link: 'players' },
      {
        label: 'Formazione',
        link: 'lineup/current',
        hidden: seasonEnded || !started,
      },
      {
        label: 'Ultima giornata',
        link: 'scores/last',
        hidden: !started,
      },
      {
        label: 'Trasferimenti',
        link: 'transferts',
        hidden: seasonEnded || !started,
      },
      { label: 'Articoli', link: 'articles' },
      { label: 'Attività', link: 'stream' },
      { label: 'Admin', link: 'admin', hidden: !(user?.admin ?? team?.admin) },
    ];
  }

  protected async openDialog(team: Team): Promise<boolean | undefined> {
    return firstValueFrom(
      this.#dialog
        .open<TeamEditModal, TeamEditModalData, boolean>(TeamEditModal, {
          data: { team },
          scrollStrategy: new NoopScrollStrategy(),
        })
        .afterClosed(),
      { defaultValue: undefined },
    );
  }

  protected scrollTo(height: number): void {
    this.#scrollService.scrollTo(0, height - 300);
  }
}
