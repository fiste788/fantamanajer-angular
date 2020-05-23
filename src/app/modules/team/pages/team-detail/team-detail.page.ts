import { trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, flatMap, pluck, tap } from 'rxjs/operators';

import { TeamService } from '@app/http';
import { ApplicationService } from '@app/services';
import { enterDetailAnimation, routerTransition } from '@shared/animations';
import { Team } from '@shared/models';

import { TeamEditModal } from '../../modals/team-edit/team-edit.modal';

@Component({
  templateUrl: './team-detail.page.html',
  styleUrls: ['./team-detail.page.scss'],
  animations: [
    enterDetailAnimation,
    trigger('contextChange', routerTransition)
  ]
})
export class TeamDetailPage implements OnInit {
  @HostBinding('@enterDetailAnimation') e = '';
  team$: Observable<Team>;
  tabs: Array<{ label: string; link: string }> = [];

  constructor(
    public app: ApplicationService,
    private readonly route: ActivatedRoute,
    private readonly teamService: TeamService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.team$ = this.route.data.pipe(
      pluck('team'),
      tap((team: Team) => {
        this.loadTabs(team);
      }));
  }

  loadTabs(team: Team): void {
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

  openDialog(team: Team): void {
    this.dialog.open(TeamEditModal, {
      data: { team }
    })
      .afterClosed()
      .pipe(
        filter(t => t),
        flatMap(() => this.teamService.getTeam(team.id))
      )
      .subscribe((t: Team) => {
        this.app.teamChange$.next(t);
        this.changeRef.detectChanges();
      });
  }
}