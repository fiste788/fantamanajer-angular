import { animate, sequence, state, style, transition, trigger } from '@angular/animations';

import { VisibilityState } from '@app/enums';

export const scrollUpAnimation = trigger('scrollUpAnimation', [
  state(VisibilityState.Hidden, style({ transform: 'translateY(-100%)', opacity: 0 })),
  state(VisibilityState.Visible, style({ transform: 'translateY(0)', opacity: 1 })),
  transition(
    `${VisibilityState.Hidden} => ${VisibilityState.Visible}`,
    sequence([
      animate(50, style({ opacity: 1 })),
      animate('500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)', style({ transform: 'translateY(0)' })),
    ]),
  ),
  transition(
    `${VisibilityState.Visible} => ${VisibilityState.Hidden}`,
    sequence([
      animate('200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)', style({ transform: 'translateY(-100%)' })),
      animate(50, style({ opacity: 0 })),
    ]),
  ),
]);
