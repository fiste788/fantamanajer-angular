import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const listItemAnimation = trigger('listItemAnimation', [
  transition(':enter', [
    query('.mat-mdc-list-item', style({ opacity: 0, transform: 'translatey(1.5rem)' }), {
      optional: true,
    }),

    query(
      '.mat-mdc-list-item',
      stagger('20ms', [
        animate('120ms 50ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      { optional: true },
    ),
  ]),
  transition(':leave', [
    query(
      '.mat-mdc-list-item',
      stagger('20ms', [
        animate('120ms 50ms ease-out', style({ opacity: 0, transform: 'translatey(1.5rem)' })),
      ]),
      { optional: true },
    ),
  ]),
]);
