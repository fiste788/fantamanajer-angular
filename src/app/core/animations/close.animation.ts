import { trigger, style, transition, animate, state } from '@angular/animations';
import { VisibilityState } from '@app/shared/layout/main/visibility-state';

export const closeAnimation = trigger('closeAnimation', [
  state(
    VisibilityState.Hidden,
    style({ opacity: 0, transform: 'scale(0)' })
  ),
  state(
    VisibilityState.Visible,
    style({ opacity: 1, transform: 'scale(1)' })
  ),
  transition('* <=> *', animate('400ms cubic-bezier(.8, -0.6, 0.2, 1.5)')),
]);
