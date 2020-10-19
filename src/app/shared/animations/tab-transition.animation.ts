import { animate, animateChild, group, sequence, style, transition, trigger } from '@angular/animations';

export const tabTransition = trigger('tabTransition', [
  transition('* <=> *', [
    sequence([
      animateChild(),
      group([
        animate('500ms cubic-bezier(.75,-0.48,.26,1.52)',
          style({ transform: 'translateX(-100vw)' }),
        ),
        style({ transform: 'translateX(100vw)', display: 'none' }),
        animate('500ms cubic-bezier(.75,-0.48,.26,1.52)',
          style({ transform: 'translateX(0%)' }),
        ),
      ]),
      animateChild(),
    ]),
  ]),
]);
