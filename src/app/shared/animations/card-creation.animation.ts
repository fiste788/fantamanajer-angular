import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

export const CardCreationAnimation = trigger('cardCreationAnimation', [
    transition('* => *', [
        query('.mat-card', style({ opacity: 0, transform: 'translatey(1.5rem)' }), { optional: true }),

        query('.mat-card', stagger('100ms', [
            animate('100ms 0ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
        ]), { optional: true }),

        query('.mat-card', [
            animate(1000, style('*'))
        ], { optional: true })
    ])
]);
