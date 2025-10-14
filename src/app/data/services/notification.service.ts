import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, share, tap } from 'rxjs';

import { NAVIGATOR } from '@app/services/navigator.service';

import { Notification, Stream } from '../types';

const NOTIFICATIONS_URL_SEGMENT = 'notifications'; // Modifica suggerita per la nomenclatura

const routes = {
  teamNotifications: (teamId: number) => `/teams/${teamId}/${NOTIFICATIONS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  teamNotificationCount: (teamId: number) => `/teams/${teamId}/${NOTIFICATIONS_URL_SEGMENT}/count`, // Aggiunta rotta per il conteggio (Refactoring suggerito)
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly #navigator = inject<Navigator>(NAVIGATOR);
  readonly #http = inject(HttpClient);

  public latestNotification = signal<Notification | undefined>(undefined); // Modifica suggerita per la nomenclatura del signal

  public getNotifications(teamId: number): Observable<Stream> {
    return this.#http.get<Stream>(routes.teamNotifications(teamId)).pipe(share()); // Utilizzo del nome della rotta modificato
  }

  public getNotificationCount(teamId: number): Observable<Stream> {
    return this.#http.get<Stream>(routes.teamNotificationCount(teamId)).pipe(
      // Utilizzo della rotta centralizzata
      tap((s) => {
        void this.#navigator.setAppBadge?.(s.unseen);
      }),
    );
  }

  public setNotification(title: string, uri: string, severity?: number): void {
    // Modifica suggerita per la nomenclatura del metodo
    this.latestNotification.set({ title, url: uri, severity: severity ?? 0 }); // Utilizzo del nome del signal modificato
  }
}
