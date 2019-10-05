import { trigger, style, transition, animate, query } from '@angular/animations';

export const createBoxAnimation = trigger('createBox', [
  transition(':enter', [
    query('img, mat-icon', style({ opacity: 0, transform: 'scale(0.4)' })),
    query('img, mat-icon',
      animate('350ms cubic-bezier(.8, -0.6, 0.2, 1.5)',
        style({ transform: 'scale(1)', opacity: 1 })
      ),
      { optional: true }
    )]
  ),
  transition(':leave', [
    query('img, mat-icon', style({ opacity: 1, transform: 'scale(1)' })),
    query('img, mat-icon',
      animate('350ms cubic-bezier(.8, -0.6, 0.2, 1.5)',

        style({ transform: 'scale(0.4)', opacity: 0 }),

      ),
      { optional: true }
    )]
  )]
);
