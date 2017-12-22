import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

export const ListItemAnimation = trigger('listItemAnimation', [
  transition(':leave', [

    query('mat-list-item', style({ opacity: 1, transform: 'translateX(0)' }), { optional: true }),

    query('mat-list-item', stagger('20ms', [
      animate('120ms 50ms ease-out', style({ opacity: 0, transform: 'translatey(20px)' })),
    ]), { optional: true })
  ]),
  transition(':enter', [
    query('mat-list-item', style({ opacity: 0, transform: 'translatey(20px)' }), { optional: true }),

    query('mat-list-item', stagger('20ms', [
      animate('120ms 50ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
    ]), { optional: true }),

    query('mat-list-item', [
      animate(1000, style('*'))
    ], { optional: true })
  ]),

]);
