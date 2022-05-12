import { trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { combineLatestWith, filter, map } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { Tab, Team, User } from '@data/types';
import { enterDetailAnimation, routerTransition } from '@shared/animations';
import { LayoutService } from 'src/app/layout/services';

import { TeamEditModal } from '../../modals/team-edit/team-edit.modal';

@Component({
  animations: [enterDetailAnimation, trigger('contextChange', routerTransition)],
  styleUrls: ['./team-detail.page.scss'],
  templateUrl: './team-detail.page.html',
})
export class TeamDetailPage {
  @HostBinding('@enterDetailAnimation') public e = '';
  public team$: Observable<Team>;
  public tabs: Array<Tab> = [];

  constructor(
    public app: ApplicationService,
    public auth: AuthenticationService,
    private readonly route: ActivatedRoute,
    private readonly layoutService: LayoutService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly dialog: MatDialog,
  ) {
    this.team$ = this.route.data.pipe(
      map((data) => data['team'] as Team),
      combineLatestWith(this.auth.user$, this.app.requireTeam$),
      map(([selectedTeam, user, team]) => {
        this.loadTabs(team, selectedTeam.championship.started, this.app.seasonEnded, user);
        return selectedTeam;
      }),
    );
  }

  public loadTabs(team: Team, started: boolean, ended: boolean, user?: User): void {
    this.tabs = [
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
  }

  public async openDialog(team: Team): Promise<void> {
    return firstValueFrom(
      this.dialog
        .open<TeamEditModal, { team: Team }, boolean>(TeamEditModal, {
          data: { team },
        })
        .afterClosed()
        .pipe(
          filter((t) => t === true),
          map(() => {
            this.app.teamSubject$.next(team);
            this.changeRef.detectChanges();
          }),
        ),
      { defaultValue: undefined },
    );
  }

  public scrollTo(height: number): void {
    this.layoutService.scrollTo(0, height - 300, undefined);
  }
}
