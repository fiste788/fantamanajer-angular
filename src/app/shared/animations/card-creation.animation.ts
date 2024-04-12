import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const cardCreationAnimation = trigger('cardCreationAnimation', [
  transition(':enter', [
    query('.mat-mdc-card', style({ opacity: 0, transform: 'translateY(10%)' }), { optional: true }),
    query(
      '.mat-mdc-card',
      stagger(40, [
        animate(
          '400ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
      { optional: true },
    ),
  ]),
]);
