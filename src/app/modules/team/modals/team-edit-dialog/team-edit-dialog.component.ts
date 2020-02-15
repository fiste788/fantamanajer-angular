import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { createBoxAnimation } from '@app/core/animations';
import { NotificationSubscription, Team } from '@app/core/models';
import { ApplicationService, TeamService } from '@app/core/services';

@Component({
  selector: 'fm-team-edit-dialog',
  templateUrl: './team-edit-dialog.component.html',
  styleUrls: ['./team-edit-dialog.component.scss'],
  animations: [createBoxAnimation]
})
export class TeamEditDialogComponent {
  validComboDrag = false;
  invalidComboDrag = false;
  team: Team;
  file: File;

  static objectToPostParams(team: Team, fieldName: string, formData: FormData): void {
    team[fieldName].forEach((element: NotificationSubscription, i: number) => {
      if (element.enabled) {
        Object.keys(element)
          .filter(f => f !== 'id')
          .forEach(field => {
            let value = element[field];
            if (field === 'enabled') {
              value = 1;
            }
            formData.append(`${fieldName}[${i}][${field}]`, value);
          });
      }
    });
  }

  constructor(
    public app: ApplicationService,
    private readonly teamService: TeamService,
    private readonly dialogRef: MatDialogRef<TeamEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { team: Team }
  ) {
    this.team = data.team;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    const myFormData = new FormData();
    if (this.file !== null) {
      myFormData.set('photo', this.file);
    }
    myFormData.append('name', this.team.name);
    TeamEditDialogComponent.objectToPostParams(this.team, 'email_notification_subscriptions', myFormData);
    TeamEditDialogComponent.objectToPostParams(this.team, 'push_notification_subscriptions', myFormData);
    this.teamService.upload(this.team.id, myFormData)
      .subscribe(() => {
        this.dialogRef.close(this.teamService.getTeam(this.team.id));
      });
  }
}
