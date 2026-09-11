import type { NotificationSubscriptionsKeys } from '@data/interfaces';

import type { Notification } from '../interfaces';

export const NOTIFICATION_SUBSCRIPTIONS: Record<NotificationSubscriptionsKeys, Notification[]> = {
  email: [
    { label: 'Punteggio giornata', name: 'score' },
    { label: 'Giocatore rubato', name: 'lost_member' },
    { label: 'Formazioni', name: 'lineups' },
  ],
  push: [
    { label: 'Punteggio giornata', name: 'score' },
    { label: 'Giocatore rubato', name: 'lost_member' },
  ],
};
