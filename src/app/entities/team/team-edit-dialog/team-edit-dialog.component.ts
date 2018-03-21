import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FileSelectDirective,
  FileDropDirective,
  FileUploader
} from 'ng2-file-upload';
import { environment } from 'environments/environment';
import { TeamService } from '../team.service';
import { Team } from '../team';
import { EmailSubscription } from 'app/entities/email-subscription/email-subscription';

@Component({
  selector: 'fm-team-edit-dialog',
  templateUrl: './team-edit-dialog.component.html',
  styleUrls: ['./team-edit-dialog.component.scss']
})
export class TeamEditDialogComponent {
  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  public team: Team;

  constructor(
    public teamService: TeamService,
    public dialogRef: MatDialogRef<TeamEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { team: Team }
  ) {
    this.team = data.team;
    const h = [
      { name: 'X-Http-Method-Override', value: 'PUT' },
      { name: 'Accept', value: 'application/json' }
    ];
    this.uploader = new FileUploader({
      url: environment.apiEndpoint + 'teams/' + this.team.id,
      authToken: 'Bearer ' + localStorage.getItem('token'),
      headers: h,
      parametersBeforeFiles: true
    });
    this.uploader.autoUpload = true;
    this.uploader.options.itemAlias = 'photo_data';
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.uploader.queue.length) {
      this.uploader.options.additionalParameter = {
        id: this.team.id,
        'email_subscription[id]': this.team.email_subscription.id,
        'email_subscription[lineups]': this.team.email_subscription.lineups ? 1 : 0,
        'email_subscription[lost_member]': this.team.email_subscription.lost_member ? 1 : 0,
        'email_subscription[score]': this.team.email_subscription.score ? 1 : 0,
      };
      this.uploader.uploadAll();
      this.uploader.onCompleteAll = () => this.dialogRef.close(this.teamService.getTeam(this.team.id));
    } else {
      this.teamService.update(this.team).subscribe(() => this.dialogRef.close());
    }
  }

  public fileOver(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
