import { trigger } from '@angular/animations';
import { NgIf, AsyncPipe } from '@angular/common';
import { Component, OnInit, afterNextRender, input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { Observable, combineLatest, firstValueFrom } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { Tab, Team } from '@data/types';
import { routerTransition } from '@shared/animations';
import { ParallaxHeaderComponent } from '@shared/components/parallax-header';
import { ToolbarTabComponent } from '@shared/components/toolbar-tab/toolbar-tab.component';
import { StatePipe } from '@shared/pipes';
import { LayoutService } from 'src/app/layout/services';

import { TeamEditModal, TeamEditModalData } from '../../modals/team-edit/team-edit.modal';

@Component({
  animations: [trigger('contextChange', routerTransition)],
  styleUrl: './team-detail.page.scss',
  templateUrl: './team-detail.page.html',
  standalone: true,
  imports: [
    NgIf,
    ParallaxHeaderComponent,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    AsyncPipe,
    StatePipe,
    MatDialogModule,
    ToolbarTabComponent,
  ],
})
export class TeamDetailPage implements OnInit {
  readonly #layoutService = inject(LayoutService);
  readonly #dialog = inject(MatDialog);

  protected team = input.required<Team>();
  protected placeholder?: string;
  protected tabs$!: Observable<Array<Tab>>;

  protected readonly app = inject(ApplicationService);
  protected readonly auth = inject(AuthenticationService);

  constructor() {
    afterNextRender(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.placeholder = history.state?.img as string;
    });
  }

  public ngOnInit(): void {
    this.tabs$ = this.loadTabs();
  }

  public loadTabs(): Observable<Array<Tab>> {
    return combineLatest([this.auth.user$, this.app.requireTeam$]).pipe(
      map(([user, team]) => {
        const { started } = this.team().championship;
        const ended = this.app.seasonEnded;

        return [
          { label: 'Giocatori', link: 'players' },
          {
            label: 'Formazione',
            link: 'lineup/current',
            hidden: ended || !started,
          },
          {
            label: 'Ultima giornata',
            link: 'scores/last',
            hidden: !started,
          },
          {
            label: 'Trasferimenti',
            link: 'transferts',
            hidden: ended || !started,
          },
          { label: 'Articoli', link: 'articles' },
          { label: 'Attività', link: 'stream' },
          { label: 'Admin', link: 'admin', hidden: !(user?.admin ?? team.admin) },
        ];
      }),
    );
  }

  protected async openDialog(team: Team): Promise<boolean | undefined> {
    return firstValueFrom(
      this.app.matchday$.pipe(
        first(),
        switchMap((m) =>
          this.#dialog
            .open<TeamEditModal, TeamEditModalData, boolean>(TeamEditModal, {
              data: { team, showChangeTeamName: m.number <= 38 },
            })
            .afterClosed(),
        ),
      ),
      { defaultValue: undefined },
    );
  }

  protected scrollTo(height: number): void {
    this.#layoutService.scrollTo(0, height - 300);
  }
}
