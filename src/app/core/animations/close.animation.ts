import { trigger, style, transition, animate, state } from '@angular/animations';
import { VisibilityState } from '@app/shared/layout/main/visibility-state';

export const CloseAnimation = trigger('closeAnimation', [
    state(
        VisibilityState.Hidden,
        style({ opacity: 0, transform: 'scale(0)' })
    ),
    state(
        VisibilityState.Visible,
        style({ opacity: 1, transform: 'scale(1)' })
    ),
    transition('* => *', animate('200ms ease-out')),
]);
