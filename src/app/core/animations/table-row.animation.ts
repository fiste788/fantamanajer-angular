import { trigger, style, transition, animate, query, stagger, sequence } from '@angular/animations';

export const tableRowAnimation = trigger('tableRowAnimation', [
  transition(':enter', [
    query('.mat-row, .mat-header-row, .mat-footer-row', style({ opacity: 0, transform: 'translateY(1.5rem)' }), { optional: true }),

    sequence([
      query('.mat-row, .mat-header-row, .mat-footer-row', stagger(20, [
        animate('250ms cubic-bezier(.8, -0.6, 0.2, 1.5)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]), { optional: true }),

      query('.mat-row, .mat-header-row, .mat-footer-row', [
        style({ opacity: 1, 'background-clip': 'padding-box' })
      ], { optional: true }),
    ])
  ]),
  transition(':leave', [
    query('.mat-row, .mat-header-row, .mat-footer-row', style({ opacity: 1, transform: 'translateY(0)' }), { optional: true }),

    query('.mat-row, .mat-header-row, .mat-footer-row', stagger(-10, [
      animate('120ms cubic-bezier(.8, -0.6, 0.2, 1.5)', style({ opacity: 0, transform: 'translateY(1.5rem)' })),
    ]), { optional: true })
  ]),
]);
