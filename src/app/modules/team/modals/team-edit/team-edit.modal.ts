import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom, map, tap } from 'rxjs';

import { TeamService } from '@data/services';
import { NotificationSubscription, notificationSubscriptionsKeys, Team } from '@data/types';
import { createBoxAnimation } from '@shared/animations';

export interface TeamEditModalData {
  team: Team;
  showChangeTeamName?: boolean;
}

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
  protected readonly showChangeTeamName?: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: TeamEditModalData,
    private readonly teamService: TeamService,
    private readonly dialogRef: MatDialogRef<TeamEditModal>,
  ) {
    this.team = data.team;
    this.showChangeTeamName = data.showChangeTeamName;
  }

  protected async save(): Promise<void> {
    const fd = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.file !== undefined) {
      fd.set('photo', this.file);
    }
    fd.set('name', this.team.name);
    for (const it of notificationSubscriptionsKeys
      .map((key) => `${key}_notification_subscriptions` as const)
      .flatMap((field) => this.objectToPostParams(this.team, field)))
      fd.append(it.name, it.value);

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
  ): Array<{ name: string; value: string }> {
    return team[fieldName]
      .filter((element) => element.enabled)
      .flatMap((element: NotificationSubscription, i) =>
        Object.keys(element)
          .filter((f): f is keyof NotificationSubscription => f !== ('id' as const))
          .map((field) => ({
            name: `${fieldName}[${i}][${field}]`,
            value: (field === 'enabled' ? 1 : element[field]) as string,
          })),
      );
  }
}
