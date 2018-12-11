import { trigger, style, transition, animate, query } from '@angular/animations';

export const EnterDetailAnimation = trigger('enterDetailAnimation', [
    transition(':enter', [
        query('.animation-container', style({ opacity: 0, transform: 'translateY(1.5rem)' })),

        query('.animation-container',
            animate('250ms 1ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
        )
    ]),
    transition(':leave', [
        query('.animation-container', style({ opacity: 1, transform: 'translateX(0)' })),

        query('.animation-container',
            animate('250ms 1ms ease-out', style({ opacity: 0, transform: 'translateY(1.5rem)' })),
        )
    ])
]);
