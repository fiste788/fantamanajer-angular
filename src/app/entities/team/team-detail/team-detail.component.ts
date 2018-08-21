import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Team } from '../team';
import { TeamEditDialogComponent } from '../team-edit-dialog/team-edit-dialog.component';
import { Observable } from 'rxjs';
import { EnterDetailAnimation } from '../../../shared/animations/enter-detail.animation';
import { EmailSubscription } from '../../email-subscription/email-subscription';
import { SharedService } from '../../../shared/shared.service';
import { ApplicationService } from '../../../core/application.service';

@Component({
  selector: 'fm-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
  animations: [EnterDetailAnimation]
})
export class TeamDetailComponent implements OnInit {
  team: Team;
  tabs: { label: string; link: string }[] = [];

  constructor(
    public app: ApplicationService,
    private route: ActivatedRoute,
    private shared: SharedService,
    private changeRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    this.tabs.push({ label: 'Giocatori', link: 'players' });
    if (app.championship.started) {
      this.tabs.push({ label: 'Formazione', link: 'lineup/current' });
      this.tabs.push({ label: 'Ultima giornata', link: 'scores/last' });
      this.tabs.push({ label: 'Trasferimenti', link: 'transferts' });
    }
    this.tabs.push({ label: 'Articoli', link: 'articles' });
    this.tabs.push({ label: 'Attività', link: 'stream' });
  }

  ngOnInit() {
    this.route.data.subscribe((data: { team: Team }) => {
      this.team = data.team;
    });
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
}
