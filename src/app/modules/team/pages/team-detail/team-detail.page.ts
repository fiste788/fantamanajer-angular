import { trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { combineLatestWith, filter, map, mergeMap } from 'rxjs/operators';

import { TeamService } from '@data/services';
import { ApplicationService } from '@app/services';
import { enterDetailAnimation, routerTransition } from '@shared/animations';
import { Tab, Team, User } from '@data/types';

import { TeamEditModal } from '../../modals/team-edit/team-edit.modal';
import { AuthenticationService } from '@app/authentication';

@Component({
  animations: [enterDetailAnimation, trigger('contextChange', routerTransition)],
  styleUrls: ['./team-detail.page.scss'],
  templateUrl: './team-detail.page.html',
})
export class TeamDetailPage implements OnInit {
  @HostBinding('@enterDetailAnimation') public e = '';
  public team$: Observable<Team>;
  public tabs: Array<Tab> = [];

  constructor(
    public app: ApplicationService,
    public auth: AuthenticationService,
    private readonly route: ActivatedRoute,
    private readonly teamService: TeamService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.team$ = this.route.data.pipe(
      map((data) => data.team as Team),
      combineLatestWith(this.auth.userChange$),
      map(([team, user]) => {
        this.loadTabs(team, user);
        return team;
      }),
    );
  }

  public loadTabs(team: Team, user?: User): void {
    this.tabs = [{ label: 'Giocatori', link: 'players' }];
    if (team.championship?.started) {
      if (!this.app.seasonEnded) {
        this.tabs.push({ label: 'Formazione', link: 'lineup/current' });
      }
      this.tabs.push({ label: 'Ultima giornata', link: 'scores/last' });
      if (!this.app.seasonEnded) {
        this.tabs.push({ label: 'Trasferimenti', link: 'transferts' });
      }
    }
    this.tabs.push({ label: 'Articoli', link: 'articles' });
    this.tabs.push({ label: 'Attività', link: 'stream' });
    if (user?.admin || team.admin) {
      this.tabs.push({ label: 'Admin', link: 'admin' });
    }
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
          mergeMap(() => this.teamService.getTeam(team.id)),
          map((t: Team) => {
            this.app.team$.next(t);
            this.changeRef.detectChanges();
            // return true;
          }),
        ),
      { defaultValue: undefined },
    );
  }
}
