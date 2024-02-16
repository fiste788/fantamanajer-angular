import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const listItemAnimation = trigger('listItemAnimation', [
  transition(':enter', [
    query('.mat-mdc-list-item', style({ opacity: 0, transform: 'translatey(1.5rem)' }), {
      optional: true,
    }),

    query(
      '.mat-mdc-list-item',
      stagger(20, [
        animate(
          '500ms cubic-bezier(0.3, 0.0, 0.8, 0.15)',
          style({ opacity: 1, transform: 'translateX(0)' }),
        ),
      ]),
      { optional: true },
    ),
  ]),
  transition(':leave', [
    query(
      '.mat-mdc-list-item.visible',
      stagger(-20, [
        animate(
          '200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)',
          style({ opacity: 0, transform: 'translatey(1.5rem)' }),
        ),
      ]),
      { optional: true },
    ),
  ]),
]);
