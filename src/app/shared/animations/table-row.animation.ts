import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

export const TableRowAnimation = trigger('tableRowAnimation', [
  transition(':leave', [

    query('mat-row', style({ opacity: 1, transform: 'translateX(0)' }), { optional: true }),

    query('mat-row', stagger('20ms', [
      animate('120ms 50ms ease-out', style({ opacity: 0, transform: 'translatey(20px)' })),
    ]), { optional: true })
  ]),
  transition(':enter', [
    query('mat-row', style({ opacity: 0, transform: 'translatey(20px)' }), { optional: true }),

    query('mat-row', stagger('20ms', [
      animate('120ms 50ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
    ]), { optional: true }),

    query('mat-row', [
      animate(1000, style('*'))
    ], { optional: true })
  ]),

]);
