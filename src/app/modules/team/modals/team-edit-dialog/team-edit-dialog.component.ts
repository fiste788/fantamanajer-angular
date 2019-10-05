import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeamService, ApplicationService } from '@app/core/services';
import { Team, NotificationSubscription } from '@app/core/models';
import { createBoxAnimation } from '@app/core/animations';

@Component({
  selector: 'fm-team-edit-dialog',
  templateUrl: './team-edit-dialog.component.html',
  styleUrls: ['./team-edit-dialog.component.scss'],
  animations: [createBoxAnimation]
})
export class TeamEditDialogComponent {
  public validComboDrag = false;
  public invalidComboDrag = false;
  public team: Team;
  public file: File;

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
    if (this.file) {
      myFormData.set('photo', this.file);
    }
    myFormData.append('name', this.team.name);
    this.objectToPostParams(this.team, 'email_notification_subscriptions', myFormData);
    this.objectToPostParams(this.team, 'push_notification_subscriptions', myFormData);
    this.teamService.upload(this.team.id, myFormData).subscribe(() => this.dialogRef.close(this.teamService.getTeam(this.team.id)));
  }

  private objectToPostParams(team: Team, fieldName: string, formData: FormData) {
    team[fieldName].forEach((element: NotificationSubscription, i: number) => {
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
