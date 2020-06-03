import { animate, style, transition, trigger } from '@angular/animations';

export const lineupDispositionAnimation = trigger('items', [
  transition(':enter', [
    style({ flex: 0.00001 }),  // initial
    animate('500ms ease',
      style({ flex: 1 }))  // final
  ]),
  transition(':leave', [
    style({ flex: 1 }),
    animate('500ms ease',
      style({
        flex: 0.00001
      }))
  ])
]);
