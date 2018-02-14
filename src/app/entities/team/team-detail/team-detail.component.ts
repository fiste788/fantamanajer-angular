import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'app/shared/auth/auth.service';
import { Team } from '../team';
import { TeamEditDialogComponent } from '../team-edit-dialog/team-edit-dialog.component';
import { Observable } from 'rxjs/Observable';
import { EnterDetailAnimation } from 'app/shared/animations/enter-detail.animation';

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
    { label: 'Ultima giornata', link: 'scores/last' },
    { label: 'Trasferimenti', link: 'transferts' },
    { label: 'Articoli', link: 'articles' }
  ];

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { team: Team }) => {
      this.team = data.team;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TeamEditDialogComponent, {
      data: { team: this.team }
    });
  }
}
