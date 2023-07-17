import {
  animate,
  animateChild,
  AnimationStateMetadata,
  AnimationTransitionMetadata,
  query,
  group,
  style,
  transition,
} from '@angular/animations';

export const routerTransition: Array<AnimationStateMetadata | AnimationTransitionMetadata> = [
  // Used when switching between different app contexts.
  transition('* <=> *', [
    // Prepare current context and next context for transition.
    query(':enter', style({ opacity: 0 }), { optional: true }),
    // Create a sequence of animations.

    // Fade out current context.
    query(':leave', query('@*', animateChild(), { optional: true }), { optional: true }), // play leave animations for view that is being removed
    group([
      query(':leave', [animate('80ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0 }))], {
        optional: true,
      }),
      // Fade in next context.
      query(':enter', [style({ opacity: 0 }), animate('80ms cubic-bezier(0.4, 0.0, 0.2, 1)')], {
        optional: true,
      }),
    ]),
    query(':enter', query('@*', animateChild(), { optional: true })), // play animations for the new view
  ]),
];
