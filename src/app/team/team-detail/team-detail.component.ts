import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SharedService } from '../../shared/shared.service';
import { Team } from '../team';
import { Member } from '../../member/member';
import { TeamService } from '../team.service';
import { AuthService } from '../../auth/auth.service';
import { TeamEditDialogComponent } from '../team-edit-dialog/team-edit-dialog.component';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

@Component({
  selector: 'fm-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss']
})
export class TeamDetailComponent implements OnInit, OnDestroy {
  team: Observable<Team>;
  members: Observable<Member[]>;
  private subscription: Subscription = new Subscription();
  tabs: { label: string; link: string }[] = [
    { label: 'Giocatori', link: 'players' },
    { label: 'Ultima giornata', link: 'scores/last' },
    { label: 'Trasferimenti', link: 'transferts' },
    { label: 'Articoli', link: 'articles' }
  ];

  constructor(
    public auth: AuthService,
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private teamService: TeamService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    const id = parseInt(this.route.snapshot.params['team_id'], 10);
    this.team = this.teamService.getTeam(id).share();
    this.subscription.add(
      this.team.subscribe(team => {
        this.members = Observable.of(team.members);
        this.sharedService.pageTitle = team.name;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TeamEditDialogComponent, {
      data: { team: this.team }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
