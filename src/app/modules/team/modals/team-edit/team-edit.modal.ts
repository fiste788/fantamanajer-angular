import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ngfModule } from 'angular-file';
import { firstValueFrom, map, tap } from 'rxjs';

import { ApplicationService } from '@app/services';
import { TeamService } from '@data/services';
import { NotificationSubscription, notificationSubscriptionsKeys, Team } from '@data/types';
import { NotificationSubscriptionComponent } from '@modules/notification-subscription/components/notification-subscription/notification-subscription.component';

export interface TeamEditModalData {
  team: Team;
}

@Component({
  styleUrl: './team-edit.modal.scss',
  templateUrl: './team-edit.modal.html',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ngfModule,
    NotificationSubscriptionComponent,
    MatButtonModule,
  ],
})
export class TeamEditModal {
  readonly #data = inject<TeamEditModalData>(MAT_DIALOG_DATA);
  readonly #teamService = inject(TeamService);
  readonly #changeRef = inject(ChangeDetectorRef);
  readonly #dialogRef = inject<MatDialogRef<TeamEditModal>>(MatDialogRef);
  readonly #snackbar = inject(MatSnackBar);

  protected readonly team = this.#data.team;
  protected readonly app = inject(ApplicationService);
  protected readonly seasonEnded = this.app.seasonEnded;
  protected validComboDrag = false;
  protected invalidComboDrag = false;
  protected file?: File;

  protected async save(): Promise<void> {
    const fd = new FormData();

    if (this.file !== undefined) {
      fd.set('photo', this.file);
    }
    fd.set('name', this.team.name);
    for (const it of notificationSubscriptionsKeys
      .map((key) => `${key}_notification_subscriptions` as const)
      .flatMap((field) => this.#objectToPostParams(this.team, field)))
      fd.append(it.name, it.value);

    return firstValueFrom(
      this.#teamService.uploadTeamPhoto(this.team.id, fd).pipe(
        tap((team) => (this.team.photo_url = team.photo_url)),
        map(async () => {
          await this.app.changeTeam(this.team);
          this.#changeRef.detectChanges();
          this.#snackbar.open('Squadra salvata correttamente');
        }),
        map(() => this.#dialogRef.close(true)),
      ),
      { defaultValue: undefined },
    );
  }

  #objectToPostParams(
    team: Team,
    fieldName: 'email_notification_subscriptions' | 'push_notification_subscriptions',
  ): Array<{
    name: string;
    value: string;
  }> {
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
