import { sequence, trigger, animate, style, group, query, transition, animateChild } from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition('* <=> *', [
    query(
      ':enter',
      [style({ opacity: 0 })],
      { optional: true }
    ),
    sequence([
      query(':leave', animateChild(), { optional: true }),
      group([
        // query(':leave', animateChild(), { optional: true }),
        query(
          ':leave',
          // here we apply a style and use the animate function to apply the style over 0.3 seconds
          [style({ opacity: 1 }), animate('0.3s', style({ opacity: 0 }))],
          { optional: true }
        ),
        query(
          ':enter',
          [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))],
          { optional: true }
        ),
        // query(':enter', animateChild(), { optional: true })
      ]),
      query(':enter', animateChild(), { optional: true }),
    ])
  ])
]);
