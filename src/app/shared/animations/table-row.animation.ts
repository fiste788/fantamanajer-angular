import { animate, query, sequence, stagger, style, transition, trigger } from '@angular/animations';

export const tableRowAnimation = trigger('tableRowAnimation', [
  transition(':enter', [
    query('.mat-row, .mat-header-row, .mat-footer-row',
      style({ opacity: 0, transform: 'translateY(1.5rem)' }),
      { optional: true },
    ),

    sequence([
      query('.mat-row, .mat-header-row, .mat-footer-row',
        stagger(20, [
          animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateX(0)' }),
          ),
        ]),
        { optional: true },
      ),

      query('.mat-row, .mat-header-row, .mat-footer-row', [
        style({ opacity: 1, 'background-clip': 'padding-box' }),
      ], { optional: true }),
    ]),
  ]),
  transition(':leave', [
    query('.mat-row, .mat-header-row, .mat-footer-row',
      stagger(-10, [
        animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ opacity: 0, transform: 'translateY(1.5rem)' }),
        ),
      ]), { optional: true },
    ),
  ]),
]);
