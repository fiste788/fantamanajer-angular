import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

export const EnterDetailAnimation = trigger('enterDetailAnimation', [
    transition('* => *', [
        query('.animation-container', style({ opacity: 0, transform: 'translatey(20px)' })),

        query('.animation-container',
            animate('250ms 1ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
        ),

        query('.animation-container', [
            animate(1000, style('*'))
        ])
    ])
]);
