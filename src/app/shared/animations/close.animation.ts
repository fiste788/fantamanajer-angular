import { animate, state, style, transition, trigger } from '@angular/animations';

import { VisibilityState } from '@app/enums';

export const closeAnimation = trigger('closeAnimation', [
  state(VisibilityState.Hidden, style({ opacity: 0, transform: 'scale(0)' })),
  state(VisibilityState.Visible, style({ opacity: 1, transform: 'scale(1)' })),
  transition(
    `${VisibilityState.Visible} <=> ${VisibilityState.Hidden}`,
    animate('500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)'),
  ),
]);
