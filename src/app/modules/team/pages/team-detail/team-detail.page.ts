import { trigger } from '@angular/animations';
import { NgIf, AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, HostBinding, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { combineLatest, firstValueFrom, Observable } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { Tab, Team } from '@data/types';
import { enterDetailAnimation, routerTransition } from '@shared/animations';
import { ParallaxHeaderComponent } from '@shared/components';
import { StatePipe } from '@shared/pipes';
import { LayoutService } from 'src/app/layout/services';

import { TeamEditModal, TeamEditModalData } from '../../modals/team-edit/team-edit.modal';

@Component({
  animations: [enterDetailAnimation, trigger('contextChange', routerTransition)],
  styleUrls: ['./team-detail.page.scss'],
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
  ],
})
export class TeamDetailPage {
  @HostBinding('@enterDetailAnimation') protected e = '';
  @Input({ required: true }) protected team!: Team;

  protected readonly tabs$: Observable<Array<Tab>>;

  constructor(
    protected readonly app: ApplicationService,
    protected readonly auth: AuthenticationService,
    private readonly layoutService: LayoutService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly dialog: MatDialog,
  ) {
    this.tabs$ = this.loadTabs();
  }

  public loadTabs(): Observable<Array<Tab>> {
    return combineLatest([this.auth.user$, this.app.requireTeam$]).pipe(
      map(([user, team]) => {
        const { started } = this.team.championship;
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

  protected async openDialog(team: Team): Promise<void> {
    return firstValueFrom(
      this.app.matchday$.pipe(
        first(),
        switchMap((m) =>
          this.dialog
            .open<TeamEditModal, TeamEditModalData, boolean>(TeamEditModal, {
              data: { team, showChangeTeamName: m.number <= 38 },
            })
            .afterClosed(),
        ),
        filter((t) => t === true),
        map(() => {
          this.app.teamSubject$.next(team);
          this.changeRef.detectChanges();
        }),
      ),
      { defaultValue: undefined },
    );
  }

  protected scrollTo(height: number): void {
    this.layoutService.scrollTo(0, height - 300);
  }
}
