import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

export const cardCreationAnimation = trigger('cardCreationAnimation', [
  transition(':enter', [
    query('.mat-card', style({ opacity: 0, transform: 'scale(0.5)' }), { optional: true }),

    query('.mat-card', stagger(70, [
      animate('350ms cubic-bezier(.8, -0.6, 0.2, 1.5)', style({ opacity: 1, transform: 'scale(1)' })),
    ]), { optional: true })
  ]),
  transition(':leave', [
    query('.mat-card', style({ opacity: 1, transform: 'scale(1)' }), { optional: true }),

    query('.mat-card', stagger(-40, [
      animate('300ms cubic-bezier(.8, -0.6, 0.2, 1.5)', style({ opacity: 0, transform: 'scale(0.5)' })),
    ]), { optional: true })
  ])
]);
