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
        '450ms cubic-bezier(.8, -0.6, 0.2, 1.5)',
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
          '400ms cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ opacity: 0, transform: 'translateY(7%)' }),
        ),
      ),
    ]),
  ]),
]);
