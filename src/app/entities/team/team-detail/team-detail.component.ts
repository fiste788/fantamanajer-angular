import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'app/shared/auth/auth.service';
import { Team } from '../team';
import { TeamEditDialogComponent } from '../team-edit-dialog/team-edit-dialog.component';
import { Observable } from 'rxjs/Observable';
import { EnterDetailAnimation } from 'app/shared/animations/enter-detail.animation';
import { EmailSubscription } from '../../email-subscription/email-subscription';
import { SharedService } from 'app/shared/shared.service';

@Component({
  selector: 'fm-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
  animations: [EnterDetailAnimation]
})
export class TeamDetailComponent implements OnInit {
  team: Team;
  tabs: { label: string; link: string }[] = [
    { label: 'Giocatori', link: 'players' },
    { label: 'Formazione', link: 'lineup/current' },
    { label: 'Ultima giornata', link: 'scores/last' },
    { label: 'Trasferimenti', link: 'transferts' },
    { label: 'Articoli', link: 'articles' }
  ];

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private shared: SharedService,
    private changeRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { team: Team }) => {
      this.team = data.team;
      if (!this.team.email_subscription) {
        this.team.email_subscription = new EmailSubscription();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TeamEditDialogComponent, {
      data: { team: this.team }
    }).afterClosed().subscribe((team?: Observable<Team>) => {
      if (team) {
        // this.route.data
        team.subscribe((res) => {
          this.team = res;
          this.shared.currentTeam = this.team;
          this.changeRef.detectChanges();
        });
      }
    });
  }
}
