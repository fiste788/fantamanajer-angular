import {
  animate,
  animateChild,
  query,
  sequence,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const enterDetailAnimation = trigger('enterDetailAnimation', [
  transition(':enter', [
    query('.animation-container', style({ opacity: 0, transform: 'translateY(7%)' })),

    query(
      '.animation-container',
      animate(
        '400ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
        style({ opacity: 1, transform: 'translateX(0)' }),
      ),
    ),
  ]),
  transition(':leave', [
    sequence([
      query('@*', [animateChild()], { optional: true }),
      query(
        '.animation-container',
        animate(
          '200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)',
          style({ opacity: 0, transform: 'translateY(7%)' }),
        ),
      ),
    ]),
  ]),
]);
