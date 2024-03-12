import {
  animate,
  group,
  query,
  sequence,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const openOverlayAnimation = trigger('openOverlayAnimation', [
  state(
    'void',
    style({
      opacity: 0,
      // This starts off from 0.01, instead of 0, because there's an issue in the Angular animations
      // as of 4.2, which causes the animation to be skipped if it starts from 0.
      transform: 'scale(0.01, 0.01)',
    }),
  ),
  transition(
    'void => enter',
    sequence([
      query('.content', style({ opacity: 0 })),
      animate('100ms linear', style({ opacity: 1, transform: 'scale(1, 0.5)' })),
      group([
        query(
          '.content',
          animate('500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)', style({ opacity: 1 })),
        ),
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'scale(1, 1)' })),
      ]),
    ]),
  ),
  transition(
    '* => leave',
    animate('200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)', style({ opacity: 0 })),
  ),
]);
