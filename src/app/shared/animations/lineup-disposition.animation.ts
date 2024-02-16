import {
  animate,
  animateChild,
  group,
  query,
  sequence,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const lineupDispositionAnimation = trigger('lineupDisposition', [
  transition(':enter', [
    query(':self', style({ flex: 0 })),
    query('.img-container', style({ opacity: 0, transform: 'scale(0.4)' }), { optional: true }),
    query(
      '.mat-mdc-select, .mat-mdc-form-field-subscript-wrapper',
      style({ opacity: 0, transform: 'translateY(-1.5rem)' }),
      { optional: true },
    ),
    sequence([
      query(':self', animate('100ms', style({ flex: 1 })), { optional: true }),
      query(
        '.img-container',
        animate(
          '500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          style({ transform: 'scale(1)', opacity: 1 }),
        ),
        { optional: true },
      ),
      group([
        query(
          '.mat-mdc-select, .mat-mdc-form-field-subscript-wrapper',
          animate(
            '500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
            style({ opacity: 1, transform: 'translateY(0)' }),
          ),
          { optional: true },
        ),
        query('@*', animateChild(), { optional: true }),
      ]),
    ]),
  ]),
  transition(
    ':leave',
    sequence([
      group([
        query('@*', animateChild(), { optional: true }),
        query(
          '.mat-mdc-select, .mat-mdc-form-field-subscript-wrapper',
          animate(
            '200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)',
            style({ opacity: 0, transform: 'translateY(-1.5rem)' }),
          ),
          { optional: true },
        ),
      ]),
      query(
        '.img-container',
        animate(
          '200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)',
          style({ transform: 'scale(0.4)', opacity: 0 }),
        ),
        { optional: true },
      ),
      query(':self', animate('100ms', style({ flex: 0.0001 })), { optional: true }),
    ]),
  ),
]);
