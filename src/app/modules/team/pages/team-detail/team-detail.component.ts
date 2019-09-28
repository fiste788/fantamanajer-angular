import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '@app/core/models';
import { EnterDetailAnimation, tabTransition } from '@app/core/animations';
import { ApplicationService } from '@app/core/services';
import { TeamEditDialogComponent } from '../../modals/team-edit-dialog/team-edit-dialog.component';

@Component({
  selector: 'fm-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
  animations: [EnterDetailAnimation, tabTransition]
})
export class TeamDetailComponent {
  private teamStatic: Team = null;
  team: Observable<Team>;
  tabs: { label: string; link: string }[] = [];

  constructor(
    public app: ApplicationService,
    private route: ActivatedRoute,
    private changeRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    this.team = this.route.data.pipe(map((data: { team: Team }) => {
      this.teamStatic = data.team;
      return data.team;
    }));
    this.loadTabs();
  }


  loadTabs() {
    this.tabs = [];
    this.tabs.push({ label: 'Giocatori', link: 'players' });
    if (this.app.championship.started) {
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
    if (this.app.user.admin || this.app.team.admin) {
      this.tabs.push({ label: 'Admin', link: 'admin' });
    }
  }

  openDialog(): void {
    this.dialog.open(TeamEditDialogComponent, {
      data: { team: this.teamStatic }
    }).afterClosed().subscribe((team?: Observable<Team>) => {
      if (team) {
        this.team = team;
        this.team.subscribe(res => {
          this.app.team = res;
          this.teamStatic = res;
          this.changeRef.detectChanges();
        });
      }
    });
  }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
