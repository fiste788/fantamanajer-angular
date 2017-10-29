import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Headers, Http, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material';
import { SharedService } from '../../shared/shared.service';
import { Team } from '../team';
import { Member } from '../../member/member';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TeamService } from '../team.service';
import {
  FileSelectDirective,
  FileDropDirective,
  FileUploader
} from 'ng2-file-upload';
import { ParallaxHeaderComponent } from '../../shared/parallax-header/parallax-header.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TeamEditDialogComponent } from '../team-edit-dialog/team-edit-dialog.component';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/share';

@Component({
  selector: 'fm-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss']
})
export class TeamDetailComponent implements OnInit, OnDestroy {
  team: Observable<Team>;
  members: Observable<Member[]>;
  private subscription: Subscription = new Subscription();
  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  tabs: { label: string; link: string }[] = [
    { label: 'Giocatori', link: 'players' },
    { label: 'Ultima giornata', link: 'scores/last' },
    { label: 'Trasferimenti', link: 'transferts' },
    { label: 'Articoli', link: 'articles' }
  ];
  // @Output() selectedTeam: EventEmitter<Team> = new EventEmitter();

  constructor(
    public sharedService: SharedService,
    public snackBar: MatSnackBar,
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
        // this.team = team;
        // this.selectedTeam.emit(team);
        this.sharedService.pageTitle = team.name;
        const h = [];
        const header = {
          name: '_method',
          value: 'PUT'
        };
        h.push(header);
        this.uploader = new FileUploader({
          url: environment.apiEndpoint + 'teams/' + team.id,
          authToken: 'Bearer ' + localStorage.getItem('token'),
          headers: h
        });
        this.uploader.autoUpload = true;
        this.uploader.options.itemAlias = 'photo';
        // this.uploader.options.method = 'PUT';
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TeamEditDialogComponent, {
      // width: '300px',
      data: { team: this.team }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
