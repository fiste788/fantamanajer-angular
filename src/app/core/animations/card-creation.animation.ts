import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

export const CardCreationAnimation = trigger('cardCreationAnimation', [
    transition(':enter', [
        query('.mat-card', style({ opacity: 0, transform: 'translateY(1.5rem)' }), { optional: true }),

        query('.mat-card', stagger(100, [
            animate('100ms 0ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
        ]), { optional: true })
    ]),
    transition(':leave', [
        query('.mat-card', style({ opacity: 1, transform: 'translateY(0)' }), { optional: true }),

        query('.mat-card', stagger(-40, [
            animate('40ms 0ms ease-out', style({ opacity: 0, transform: 'translateX(-1.5rem)' })),
        ]), { optional: true })
    ])
]);
