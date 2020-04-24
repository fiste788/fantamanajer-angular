import { trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, flatMap, pluck, tap } from 'rxjs/operators';

import { TeamService } from '@app/http';
import { ApplicationService } from '@app/services';
import { enterDetailAnimation, routerTransition } from '@shared/animations';
import { Team } from '@shared/models';

import { TeamEditDialogComponent } from '../../modals/team-edit-dialog/team-edit-dialog.component';

@Component({
  selector: 'fm-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
  animations: [
    enterDetailAnimation,
    trigger('contextChange', routerTransition)
  ]
})
export class TeamDetailComponent implements OnInit {
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
    this.dialog.open(TeamEditDialogComponent, {
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

  getContext(routerOutlet: RouterOutlet): string {
    return routerOutlet.activatedRouteData.state;
  }
}
