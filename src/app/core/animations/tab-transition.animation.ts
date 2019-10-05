import { sequence, trigger, animate, style, group, query, transition, animateChild } from '@angular/animations';

export const tabTransition = trigger('tabTransition', [
  transition('* => *', [
    style({ position: 'absolute', width: '100%' }),
    style({ transform: 'translateX(100vw)', display: 'none' }),
    sequence([
      animateChild(),
      group([
        style({ transform: 'translateX(0%)' }),
        animate('500ms cubic-bezier(.75,-0.48,.26,1.52)',
          style({ transform: 'translateX(-100vw)' })),
        style({ transform: 'translateX(100vw)', display: 'none' }),
        animate('500ms cubic-bezier(.75,-0.48,.26,1.52)',
          style({ transform: 'translateX(0%)' }))
      ]),
      animateChild()
    ])
  ])
]);
