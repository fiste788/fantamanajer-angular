import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TeamService } from '@app/http';
import { ApplicationService } from '@app/services';
import { createBoxAnimation } from '@shared/animations';
import { NotificationSubscription, Team } from '@shared/models';

@Component({
  templateUrl: './team-edit.modal.html',
  styleUrls: ['./team-edit.modal.scss'],
  animations: [createBoxAnimation]
})
export class TeamEditModal {
  validComboDrag = false;
  invalidComboDrag = false;
  team: Team;
  file?: File;

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
    private readonly dialogRef: MatDialogRef<TeamEditModal>,
    @Inject(MAT_DIALOG_DATA) public data: { team: Team }
  ) {
    this.team = data.team;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    const fd = new FormData();
    if (this.file !== undefined) {
      fd.set('photo', this.file);
    }
    fd.set('name', this.team.name);
    TeamEditModal.objectToPostParams(this.team, 'email_notification_subscriptions', fd);
    TeamEditModal.objectToPostParams(this.team, 'push_notification_subscriptions', fd);
    this.teamService.upload(this.team.id, fd)
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }
}
