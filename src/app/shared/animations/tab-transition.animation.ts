import { sequence, trigger, animate, style, group, query, transition, animateChild } from '@angular/animations';

export const tabTransition = trigger('tabTransition', [
    transition('* => *', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        query(':enter', style({ transform: 'translateX(100vw)', display: 'none' }), { optional: true }),
        sequence([
            // sequence([
            query(':leave', animateChild(), { optional: true }),
            // query(':leave', animateChild()),
            // ]),
            group([
                query(':leave', [
                    style({ transform: 'translateX(0%)' }),
                    animate('500ms cubic-bezier(.75,-0.48,.26,1.52)',
                        style({ transform: 'translateX(-100vw)' }))
                ], { optional: true }),
                query(':enter', [
                    style({ transform: 'translateX(100vw)', display: 'none' }),
                    animate('500ms cubic-bezier(.75,-0.48,.26,1.52)',
                        style({ transform: 'translateX(0%)' }))
                ], { optional: true }),
            ]),
            // sequence([
            // query(':enter', animateChild()),
            query(':enter', animateChild(), { optional: true })
            // ])
        ])
    ])
]);
