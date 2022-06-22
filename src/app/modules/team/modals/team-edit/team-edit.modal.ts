import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom, map, tap } from 'rxjs';

import { ApplicationService } from '@app/services';
import { TeamService } from '@data/services';
import { NotificationSubscription, Team } from '@data/types';
import { createBoxAnimation } from '@shared/animations';

@Component({
  animations: [createBoxAnimation],
  styleUrls: ['./team-edit.modal.scss'],
  templateUrl: './team-edit.modal.html',
})
export class TeamEditModal {
  protected validComboDrag = false;
  protected invalidComboDrag = false;
  protected file!: File;
  protected readonly team: Team;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { team: Team },
    protected readonly app: ApplicationService,
    private readonly teamService: TeamService,
    private readonly dialogRef: MatDialogRef<TeamEditModal>,
  ) {
    this.team = data.team;
  }

  protected async save(): Promise<void> {
    const fd = new FormData();
    if (this.file !== undefined) {
      fd.set('photo', this.file);
    }
    fd.set('name', this.team.name);
    this.objectToPostParams(this.team, 'email_notification_subscriptions', fd);
    this.objectToPostParams(this.team, 'push_notification_subscriptions', fd);
    return firstValueFrom(
      this.teamService.upload(this.team.id, fd).pipe(
        tap((t) => (this.team.photo_url = t.photo_url)),
        map(() => this.dialogRef.close(true)),
      ),
      { defaultValue: undefined },
    );
  }

  private objectToPostParams(
    team: Team,
    fieldName: 'email_notification_subscriptions' | 'push_notification_subscriptions',
    formData: FormData,
  ): void {
    team[fieldName].forEach((element: NotificationSubscription, i) => {
      if (element.enabled) {
        Object.keys(element)
          .filter((f): f is keyof NotificationSubscription => f !== ('id' as const))
          .forEach((field) => {
            let value = element[field];
            if (field === 'enabled') {
              value = 1;
            }
            formData.append(`${fieldName}[${i}][${field}]`, value as string);
          });
      }
    });
  }
}
