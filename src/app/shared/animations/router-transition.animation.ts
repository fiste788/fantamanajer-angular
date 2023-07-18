import {
  animateChild,
  AnimationStateMetadata,
  AnimationTransitionMetadata,
  query,
  style,
  transition,
} from '@angular/animations';

export const routerTransition: Array<AnimationStateMetadata | AnimationTransitionMetadata> = [
  // Used when switching between different app contexts.
  transition('void => *', [
    query(':enter', [style({ opacity: '0' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),

    query('@contextChange', animateChild(), { optional: true }),
    query(':enter', animateChild(), { optional: true }),
  ]),
];
