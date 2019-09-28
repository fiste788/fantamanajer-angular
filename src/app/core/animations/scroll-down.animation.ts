import { trigger, style, transition, animate, state } from '@angular/animations';
import { VisibilityState } from '@app/shared/layout/main/visibility-state';

export const ScrollDownAnimation = trigger('scrollDownAnimation', [
    state(
        VisibilityState.Hidden,
        style({ opacity: 0, transform: 'translateY(100%)' })
    ),
    state(
        VisibilityState.Visible,
        style({ opacity: 1, transform: 'translateY(0)' })
    ),
    transition('* => *', animate('200ms ease-in')),
]);
