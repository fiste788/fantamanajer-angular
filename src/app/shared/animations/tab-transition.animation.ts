import {
  animate,
  animateChild,
  group,
  query,
  sequence,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const tabTransition = trigger('tabTransition', [
  transition('* <=> *', [
    sequence([
      query('@*', animateChild(), { optional: true }),
      group([
        animate(
          '500ms cubic-bezier(.75,-0.48,.26,1.52)',
          style({ transform: 'translateX(-100vw)' }),
        ),
        style({ transform: 'translateX(100vw)', display: 'none' }),
        animate('500ms cubic-bezier(.75,-0.48,.26,1.52)', style({ transform: 'translateX(0%)' })),
      ]),
      query('@*', animateChild(), { optional: true }),
    ]),
  ]),
]);
