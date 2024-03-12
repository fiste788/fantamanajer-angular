import { animate, state, style, transition, trigger } from '@angular/animations';

import { VisibilityState } from '@app/enums';

export const closeAnimation = trigger('closeAnimation', [
  state(VisibilityState.Hidden, style({ transform: 'scale(0)' })),
  state(VisibilityState.Visible, style({ transform: 'scale(1)' })),
  transition(
    `${VisibilityState.Hidden} => ${VisibilityState.Visible}`,
    animate('400ms cubic-bezier(0.05, 0.7, 0.1, 1.0)'),
  ),
  transition(
    `${VisibilityState.Visible} => ${VisibilityState.Hidden}`,
    animate('200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)'),
  ),
]);
