import { animate, sequence, state, style, transition, trigger } from '@angular/animations';

import { VisibilityState } from '@app/enums';

export const scrollUpAnimation = trigger('scrollUpAnimation', [
  state(
    VisibilityState.Hidden,
    style({ transform: 'translateY(-100%)', opacity: 0 }),
  ),
  state(
    VisibilityState.Visible,
    style({ transform: 'translateY(0)', opacity: 1 }),
  ),
  transition(`${VisibilityState.Hidden} => ${VisibilityState.Visible}`,
    sequence([
      animate(50, style({ opacity: 1 })),
      animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)' })),
    ]),
  ),
  transition(`${VisibilityState.Visible} => ${VisibilityState.Hidden}`,
    sequence([
      animate('300ms cubic-bezier(0.4, 0, 0.6, 1)', style({ transform: 'translateY(-100%)' })),
      animate(50, style({ opacity: 0 })),
    ]),
  ),
]);
