import { animate, query, style, transition, trigger } from '@angular/animations';

export const createBoxAnimation = trigger('createBox', [
  transition(':enter', [
    query(':scope>img, mat-icon, .img-container',
      style({ opacity: 0, transform: 'scale(0.4)' }),
      { optional: true },
    ),
    query(':scope>img, mat-icon, .img-container',
      animate('450ms cubic-bezier(.8, -0.6, 0.2, 1.5)',
        style({ transform: 'scale(1)', opacity: 1 }),
      ),
      { optional: true },
    )],
  ),
  transition(':leave', [
    query(':scope>img, mat-icon, .img-container',
      animate('400ms cubic-bezier(.8, -0.6, 0.2, 1.5)',
        style({ transform: 'scale(0.4)', opacity: 0 }),
      ),
      { optional: true },
    )],
  )],
);
