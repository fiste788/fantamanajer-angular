import { trigger, style, transition, animate, query, stagger, sequence } from '@angular/animations';

export const TableRowAnimation = trigger('tableRowAnimation', [
  transition(':enter', [
    query('.mat-row, .mat-header-row, .mat-footer-row', style({ opacity: 0, transform: 'translateY(1.5rem)' }), { optional: true }),

    sequence([
      query('.mat-row, .mat-header-row, .mat-footer-row', stagger(20, [
        animate('120ms 50ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]), { optional: true }),

      query('.mat-row, .mat-header-row, .mat-footer-row', [
        style({ opacity: 1, 'background-clip': 'padding-box' })
      ], { optional: true }),
    ])
  ]),
  transition(':leave', [
    query('.mat-row, .mat-header-row, .mat-footer-row', style({ opacity: 1, transform: 'translateY(0)' }), { optional: true }),

    query('.mat-row, .mat-header-row, .mat-footer-row', stagger(-10, [
      animate('60ms 50ms ease-out', style({ opacity: 0, transform: 'translateY(1.5rem)' })),
    ]), { optional: true })
  ]),
]);
