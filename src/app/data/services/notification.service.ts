import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';

import { share, tap } from 'rxjs';
import type { Observable } from 'rxjs';

import { NAVIGATOR } from '@app/services/navigator.service';

import type { Notification, Stream } from '../interfaces';

const NOTIFICATIONS_URL_SEGMENT = 'notifications'; // Modifica suggerita per la nomenclatura

const routes = {
  teamNotificationCount: (teamId: number) => `/teams/${teamId}/${NOTIFICATIONS_URL_SEGMENT}/count`, // Aggiunta rotta per il conteggio (Refactoring suggerito)
  teamNotifications: (teamId: number) => `/teams/${teamId}/${NOTIFICATIONS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
};

@Service()
export class NotificationService {

  readonly #http = inject(HttpClient);
  readonly #navigator = inject<Navigator>(NAVIGATOR);

  public readonly latestNotification = signal<Notification | undefined>(undefined); // Modifica suggerita per la nomenclatura del signal

  public getNotificationCount(teamId: number): Observable<Stream> {
    return this.#http.get<Stream>(routes.teamNotificationCount(teamId)).pipe(
      // Utilizzo della rotta centralizzata
      tap(async (s) => {
        await this.#navigator.setAppBadge(s.unseen);
      }),
    );
  }

  public getNotifications(teamId: number): Observable<Stream> {
    return this.#http.get<Stream>(routes.teamNotifications(teamId)).pipe(share()); // Utilizzo del nome della rotta modificato
  }

  public setNotification(title: string, uri: string, severity?: number): void {
    // Modifica suggerita per la nomenclatura del metodo
    this.latestNotification.set({ severity: severity ?? 0, title, url: uri }); // Utilizzo del nome del signal modificato
  }

}
