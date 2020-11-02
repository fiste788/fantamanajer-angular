export interface Notification {
  name: string;
  label: string;
}

export type Keys = 'email' | 'push';

export const notificationSubscriptions: { [K in Keys]: Array<Notification> } = {
  email: [
    { name: 'score', label: 'Punteggio giornata' },
    { name: 'lost_member', label: 'Giocatore rubato' },
    { name: 'lineups', label: 'Formazioni' },
  ],
  push: [
    { name: 'score', label: 'Punteggio giornata' },
    { name: 'lost_member', label: 'Giocatore rubato' },
  ],
};
