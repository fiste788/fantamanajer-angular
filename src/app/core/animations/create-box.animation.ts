import { trigger, style, transition, animate, query, keyframes } from '@angular/animations';

export const CreateBoxAnimation = trigger('createBox', [
  transition(':enter', [
    query('img, mat-icon', [
      animate('250ms ease-in',
        keyframes([
          style({ transform: 'scale(0)', offset: 0 }),
          style({ transform: 'scale(1.1)', offset: 0.8 }),
          style({ transform: 'scale(1)', offset: 1 })
        ])
      )],
      { optional: true }
    )]
  ),
  transition(':leave', [
    query('img, mat-icon', [
      animate('250ms ease-in',
        keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.1)', offset: 0.2 }),
          style({ transform: 'scale(0)', offset: 1 })
        ])
      )],
      { optional: true }
    )]
  )]
);
