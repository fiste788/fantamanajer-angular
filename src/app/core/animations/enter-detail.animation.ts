import { trigger, style, transition, animate, query } from '@angular/animations';

export const enterDetailAnimation = trigger('enterDetailAnimation', [
  transition(':enter', [
    query('.animation-container', style({ opacity: 0, transform: 'translateY(1.5rem)' })),

    query('.animation-container',
      animate('350ms cubic-bezier(.8, -0.6, 0.2, 1.5)', style({ opacity: 1, transform: 'translateX(0)' })),
    )
  ]),
  transition(':leave', [
    query('.animation-container', style({ opacity: 1, transform: 'translateX(0)' })),

    query('.animation-container',
      animate('350ms cubic-bezier(.8, -0.6, 0.2, 1.5)', style({ opacity: 0, transform: 'translateY(1.5rem)' })),
    )
  ])
]);
