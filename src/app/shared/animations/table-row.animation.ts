import { animate, query, sequence, stagger, style, transition, trigger } from '@angular/animations';

export const tableRowAnimation = trigger('tableRowAnimation', [
  transition(':enter', [
    query(
      '.mat-mdc-row, .mat-mdc-header-row, .mat-mdc-footer-row',
      style({ opacity: 0, transform: 'translateY(1.5rem)' }),
      { optional: true },
    ),

    sequence([
      query(
        '.mat-mdc-row, .mat-mdc-header-row, .mat-mdc-footer-row',
        stagger(20, [
          animate(
            '500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
            style({ opacity: 1, transform: 'translateX(0)' }),
          ),
        ]),
        { optional: true },
      ),

      query('.mat-mdc-row, .mat-mdc-header-row, .mat-mdc-footer-row', [style({ opacity: 1 })], {
        optional: true,
      }),
    ]),
  ]),
]);
