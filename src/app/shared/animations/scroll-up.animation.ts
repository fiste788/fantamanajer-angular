import { trigger, style, transition, animate, query, state } from '@angular/animations';

export const ScrollUpAnimation = trigger('scrollUpAnimation', [

    state('up', style({
        transform: 'translateY(0)'
    })),
    state('down', style({
        transform: 'translateY(calc(-100% - 0.5rem))'
    })),
    transition('up => down', animate('250ms ease-out')),
    transition('down => up', animate('250ms ease-in'))

]);
