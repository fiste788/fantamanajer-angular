import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const createBoxAnimation = trigger('createBox', [
  transition(':enter', [
    query(
      ':scope>img, .mat-icon, .img-container, .icon-container>span',
      style({ opacity: 0, transform: 'scale(0.4)' }),
      {
        optional: true,
      },
    ),
    query(
      ':scope>img, .mat-icon, .img-container, .icon-container>span',
      stagger(40, [
        animate(
          '500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          style({ transform: 'scale(1)', opacity: 1 }),
        ),
      ]),
      { optional: true },
    ),
  ]),
  transition(':leave', [
    query(
      ':scope>img, .mat-icon, .img-container, .icon-container>span',
      stagger(40, [
        animate(
          '200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)',
          style({ transform: 'scale(0.4)', opacity: 0 }),
        ),
      ]),
      { optional: true },
    ),
  ]),
]);
