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
            '250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
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
  transition(':leave', [
    query(
      '.mat-mdc-row.visible, .mat-mdc-header-row.visible, .mat-mdc-footer-row.visible',
      stagger(-10, [
        animate(
          '200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ opacity: 0, transform: 'translateY(1.5rem)' }),
        ),
      ]),
      { optional: true },
    ),
  ]),
]);
