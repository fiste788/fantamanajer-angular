import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ApplicationService } from '@app/core/services';
import { enterDetailAnimation } from '@app/shared/animations';
import { Team } from '@app/shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeamEditDialogComponent } from '../../modals/team-edit-dialog/team-edit-dialog.component';

@Component({
  selector: 'fm-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
  animations: [enterDetailAnimation]
})
export class TeamDetailComponent implements OnInit {
  team: Observable<Team>;
  tabs: Array<{ label: string; link: string }> = [];

  constructor(
    public app: ApplicationService,
    private readonly route: ActivatedRoute,
    private readonly changeRef: ChangeDetectorRef,
    private readonly dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.team = this.route.data.pipe(map((data: { team: Team }) => {
      this.loadTabs(data.team);

      return data.team;
    }));
  }

  loadTabs(team: Team): void {
    this.tabs = [];
    this.tabs.push({ label: 'Giocatori', link: 'players' });
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
      .subscribe((t?: Observable<Team>) => {
        if (t) {
          this.team = t;
          this.team.subscribe(res => {
            if (this.app.team) {
              this.app.team.photo_url = res.photo_url;
              this.app.team.name = res.name;
              this.app.team.email_notification_subscriptions = res.email_notification_subscriptions;
              this.app.team.push_notification_subscriptions = res.push_notification_subscriptions;
            }
            this.changeRef.detectChanges();
          });
        }
      });
  }

  getState(outlet: RouterOutlet): string {
    return outlet.isActivated ? outlet.activatedRouteData.state : '';
  }
}
