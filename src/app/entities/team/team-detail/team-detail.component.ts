import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Team } from '../team';
import { TeamEditDialogComponent } from '../team-edit-dialog/team-edit-dialog.component';
import { Observable } from 'rxjs';
import { EnterDetailAnimation } from '../../../shared/animations/enter-detail.animation';
import { ApplicationService } from '../../../core/application.service';
import { tabTransition } from 'app/shared/animations/tab-transition.animation';

@Component({
  selector: 'fm-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
  animations: [EnterDetailAnimation, tabTransition]
})
export class TeamDetailComponent implements OnInit {
  team: Team;
  tabs: { label: string; link: string }[] = [];

  constructor(
    public app: ApplicationService,
    private route: ActivatedRoute,
    private changeRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.route.data.subscribe((data: { team: Team }) => {
      this.team = data.team;
      this.loadTabs();
    });

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
      data: { team: this.team }
    }).afterClosed().subscribe((team?: Observable<Team>) => {
      if (team) {
        // this.route.data
        team.subscribe((res) => {
          this.team = res;
          this.app.team = this.team;
          this.changeRef.detectChanges();
        });
      }
    });
  }

  getState(outlet) {
    // Changing the activatedRouteData.state triggers the animation
    return outlet.activatedRouteData.state;
  }
}
