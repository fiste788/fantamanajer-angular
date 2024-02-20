import { animate, group, query, state, style, transition, trigger } from '@angular/animations';

import { VisibilityState } from '@app/enums';

export const scrollUpAnimation = trigger('scrollUpAnimation', [
  state(VisibilityState.Hidden, style({ transform: 'translateY(-100%)' })),
  state(VisibilityState.Visible, style({ transform: 'translateY(0)' })),
  transition(
    `${VisibilityState.Hidden} => ${VisibilityState.Visible}`,
    group([
      query('.mat-toolbar-row', animate(300, style({ opacity: 1 }))),
      animate('400ms cubic-bezier(0.05, 0.7, 0.1, 1.0)', style({ transform: 'translateY(0)' })),
    ]),
  ),
  transition(
    `${VisibilityState.Visible} => ${VisibilityState.Hidden}`,
    group([
      animate('200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)', style({ transform: 'translateY(-100%)' })),
      query('.mat-toolbar-row', animate(150, style({ opacity: 0 }))),
    ]),
  ),
]);
