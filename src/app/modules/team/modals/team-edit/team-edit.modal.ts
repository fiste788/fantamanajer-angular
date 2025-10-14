import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { save } from '@app/functions';
import { ApplicationService } from '@app/services';
import { TeamService } from '@data/services';
import { NotificationSubscription, notificationSubscriptionsKeys, Team } from '@data/types';
import { NotificationSubscriptionComponent } from '@modules/notification-subscription/components/notification-subscription/notification-subscription.component';

@Component({
  styleUrl: './team-edit.modal.scss',
  templateUrl: './team-edit.modal.html',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NotificationSubscriptionComponent,
    MatButtonModule,
  ],
})
export class TeamEditModal {
  readonly #teamService = inject(TeamService);
  readonly #changeRef = inject(ChangeDetectorRef);
  readonly #dialogRef = inject<MatDialogRef<TeamEditModal>>(MatDialogRef);
  readonly #snackbar = inject(MatSnackBar);

  protected readonly team = inject<Team>(MAT_DIALOG_DATA);
  protected readonly app = inject(ApplicationService);
  protected readonly seasonEnded = this.app.seasonEnded;
  protected file = signal<File | undefined>(undefined);
  protected dropzoneState = signal<'idle' | 'valid-drag' | 'invalid-drag'>('idle');
  protected dropClass = signal<File | undefined>(undefined);
  protected fileUrl = computed(() => {
    const currentFile = this.file();

    return currentFile ? URL.createObjectURL(currentFile) : undefined;
  });

  protected onFileSelected(target: HTMLInputElement): void {
    this.#setFile(target.files?.[0]);
  }

  protected onFileDropped(event: DragEvent, accept: string): void {
    event.preventDefault();
    event.stopPropagation();

    this.dropzoneState.set('idle');
    const file = event.dataTransfer?.files[0];
    if (file && this.#acceptType(file.type, accept)) {
      this.#setFile(file);
    } else {
      this.#setFile(undefined);
    }
  }

  protected onDragOver(event: DragEvent, accept: string): void {
    event.preventDefault(); // Necessario per consentire il drop.
    const item = event.dataTransfer?.items[0];
    this.dropzoneState.set(
      item && this.#acceptType(item.type, accept) ? 'valid-drag' : 'invalid-drag',
    );
  }

  protected onDragLeave(): void {
    this.dropzoneState.set('idle');
  }

  protected async save(): Promise<void> {
    const fd = new FormData();

    const currentFile = this.file();
    if (currentFile) {
      fd.set('photo', currentFile);
    }
    fd.set('name', this.team.name);
    for (const it of notificationSubscriptionsKeys
      .map((key) => `${key}_notification_subscriptions` as const)
      .flatMap((field) => this.#objectToPostParams(this.team, field)))
      fd.append(it.name, it.value);

    return save(this.#teamService.uploadTeamPhoto(this.team.id, fd), undefined, this.#snackbar, {
      message: 'Squadra salvata correttamente',
      callback: async (team) => {
        this.team.photo_url = team.photo_url;
        await this.app.changeTeam(this.team);
        this.#dialogRef.close(true);

        return this.#changeRef.detectChanges();
      },
    });
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

  #acceptType(fileType: string, accept?: string): boolean {
    // Se non viene specificato un valore per `accept`, tutti i tipi sono accettati.
    if (!accept) {
      return true;
    }

    const acceptTypes = accept.split(',').map((a) => a.trim());

    return acceptTypes.some((acceptType) => {
      if (acceptType.startsWith('.')) {
        return fileType.endsWith(acceptType);
      }
      if (acceptType.endsWith('/*')) {
        return fileType.startsWith(acceptType.slice(0, -2));
      }

      return fileType === acceptType;
    });
  }

  // Centralizza l'aggiornamento del file per ridurre la duplicazione (principio DRY).
  #setFile(file?: File): void {
    if (file) {
      this.file.set(file);
    }
  }
}
