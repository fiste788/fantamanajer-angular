import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

export const cardCreationAnimation = trigger('cardCreationAnimation', [
  transition(':enter', [
    query('.mat-card',
      style({ opacity: 0, transform: 'translateY(10%)' }),
      { optional: true }
    ),
    query('.mat-card',
      stagger(75, [
        animate('450ms cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]), { optional: true }
    )
  ]),
  transition(':leave', [
    query('.mat-card',
      stagger(-40, [
        animate('.4s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ opacity: 0, transform: 'translateY(10%)' })
        ),
      ]), { optional: true }
    )
  ])
]);
