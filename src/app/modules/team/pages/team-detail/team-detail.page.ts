import { trigger } from '@angular/animations';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AsyncPipe } from '@angular/common';
import { Component, afterNextRender, input, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { combineLatest, firstValueFrom } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { Tab, Team, User } from '@data/types';
import { routerTransition } from '@shared/animations';
import { ParallaxHeaderComponent } from '@shared/components/parallax-header';
import { PrimaryTabComponent } from '@shared/components/primary-tab/primary-tab.component';
import { LayoutService } from 'src/app/layout/services';

import { TeamEditModal, TeamEditModalData } from '../../modals/team-edit/team-edit.modal';

@Component({
  animations: [trigger('contextChange', routerTransition)],
  styleUrl: './team-detail.page.scss',
  templateUrl: './team-detail.page.html',
  imports: [
    ParallaxHeaderComponent,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    MatDialogModule,
    PrimaryTabComponent,
  ],
})
export class TeamDetailPage {
  readonly #layoutService = inject(LayoutService);
  readonly #dialog = inject(MatDialog);

  protected team = input.required<Team>();
  protected placeholder?: string;

  protected readonly app = inject(ApplicationService);
  protected readonly auth = inject(AuthenticationService);
  protected readonly context = toSignal(
    combineLatest({ user: this.auth.user$, team: this.app.requireTeam$ }),
    { requireSync: true },
  );

  protected tabs = linkedSignal(() => {
    const context = this.context();

    return this.loadTabs(this.team(), context.team, this.app.seasonEnded(), context.user);
  });

  constructor() {
    afterNextRender(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.placeholder = history.state?.img as string | undefined;
    });
  }

  public loadTabs(currentTeam: Team, team: Team, seasonEnded = false, user?: User): Array<Tab> {
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
      { label: 'Admin', link: 'admin', hidden: !(user?.admin ?? team.admin) },
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
    this.#layoutService.scrollTo(0, height - 300);
  }
}
