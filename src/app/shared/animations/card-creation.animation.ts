import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const cardCreationAnimation = trigger('cardCreationAnimation', [
  transition(':enter', [
    query('.mat-card',
      style({ opacity: 0, transform: 'translateY(10%)' }),
      { optional: true },
    ),
    query('.mat-card',
      stagger(60, [
        animate('350ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]), { optional: true },
    ),
  ]),
  transition(':leave', [
    query('.mat-card',
      stagger(-40, [
        animate('.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ opacity: 0, transform: 'translateY(10%)' }),
        ),
      ]), { optional: true },
    ),
  ]),
]);
