import { animate, query, sequence, style, transition, trigger } from '@angular/animations';

export const lineupDispositionAnimation = trigger('lineupDisposition', [
  transition(':enter', [
    query('.img-container',
      style({ opacity: 0, transform: 'scale(0.4)' }),
      { optional: true }
    ),
    query('.mat-select, .mat-form-field-underline, .mat-form-field-subscript-wrapper',
      style({ opacity: 0, transform: 'translateY(-1.5rem)' }),
      { optional: true }
    ),
    sequence([
      query('.img-container',
        animate('350ms cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 })
        ),
        { optional: true }
      ),
      query('.mat-select, .mat-form-field-underline, .mat-form-field-subscript-wrapper',
        animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
        { optional: true }
      )
    ])
  ]
  ),
  transition(':leave', [
    query('.img-container',
      animate('300ms cubic-bezier(.8, -0.6, 0.2, 1.5)',
        style({ transform: 'scale(0.4)', opacity: 0 })
      ),
      { optional: true }
    )]
  )]
);
