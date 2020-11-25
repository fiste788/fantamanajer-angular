import { trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, mergeMap, pluck, tap } from 'rxjs/operators';

import { TeamService } from '@data/services';
import { ApplicationService } from '@app/services';
import { enterDetailAnimation, routerTransition } from '@shared/animations';
import { Team } from '@data/types';

import { TeamEditModal } from '../../modals/team-edit/team-edit.modal';

@Component({
  animations: [
    enterDetailAnimation,
    trigger('contextChange', routerTransition),
  ],
  styleUrls: ['./team-detail.page.scss'],
  templateUrl: './team-detail.page.html',
})
export class TeamDetailPage implements OnInit {
  @HostBinding('@enterDetailAnimation') public e = '';
  public team$: Observable<Team>;
  public tabs: Array<{ label: string; link: string }> = [];

  constructor(
    public app: ApplicationService,
    private readonly route: ActivatedRoute,
    private readonly teamService: TeamService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.team$ = this.route.data.pipe(
      pluck('team'),
      tap((team: Team) => {
        this.loadTabs(team);
      }));
  }

  public loadTabs(team: Team): void {
    this.tabs = [{ label: 'Giocatori', link: 'players' }];
    if (this.app.championship?.started) {
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
    if (this.app.user?.admin || team.admin) {
      this.tabs.push({ label: 'Admin', link: 'admin' });
    }
  }

  public openDialog(team: Team): void {
    this.dialog.open(TeamEditModal, {
      data: { team },
    })
      .afterClosed()
      .pipe(
        filter(t => t),
        mergeMap(() => this.teamService.getTeam(team.id)),
      )
      .subscribe((t: Team) => {
        this.app.teamChange$.next(t);
        this.changeRef.detectChanges();
      });
  }
}
