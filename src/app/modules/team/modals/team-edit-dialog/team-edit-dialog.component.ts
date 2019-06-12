import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { environment } from '@env/environment';
import { TeamService, ApplicationService } from '@app/core/services';
import { Team, NotificationSubscription } from '@app/core/models';

@Component({
  selector: 'fm-team-edit-dialog',
  templateUrl: './team-edit-dialog.component.html',
  styleUrls: ['./team-edit-dialog.component.scss']
})
export class TeamEditDialogComponent {
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  public team: Team;
  public files: File[] = [];


  constructor(
    public app: ApplicationService,
    public teamService: TeamService,
    public dialogRef: MatDialogRef<TeamEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { team: Team }
  ) {
    this.team = data.team;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    const myFormData = new FormData();
    if (this.files.length) {
      myFormData.append('photo', this.files[0]);
    }
    myFormData.append('id', this.team.id.toString());
    myFormData.append('name', this.team.name);
    this.objectToPostParams(this.team, 'email_notification_subscriptions', myFormData);
    this.objectToPostParams(this.team, 'push_notification_subscriptions', myFormData);
    this.teamService.upload(this.team.id, myFormData).subscribe(() => this.dialogRef.close(this.teamService.getTeam(this.team.id)));
  }

  private objectToPostParams(team: Team, fieldName: string, formData: FormData) {
    team[fieldName].forEach((element: NotificationSubscription, i) => {
      if (element.enabled) {
        Object.keys(element).filter(f => f !== 'id').forEach(field => {
          let value = element[field];
          if (field === 'enabled') {
            value = 1;
          }
          formData.append(fieldName + '[' + i + '][' + field + ']', value);
        });
      }
    });
  }
}
