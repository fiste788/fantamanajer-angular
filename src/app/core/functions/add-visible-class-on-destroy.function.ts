import {
  AnimationTriggerMetadata,
  AnimationTransitionMetadata,
  AnimationMetadataType,
  AnimationMetadata,
  AnimationQueryMetadata,
} from '@angular/animations';
import { inject, DestroyRef } from '@angular/core';

const CLASS_NAME = 'visible';

function parseLeaveAnimation(am: AnimationMetadata): Array<string> {
  if (am.type === AnimationMetadataType.Query) {
    const it = am as AnimationQueryMetadata;
    if (it.selector.indexOf(`.${CLASS_NAME}`)) {
      return it.selector
        .split(',')
        .map((s) => s.slice(0, Math.max(0, s.indexOf(`.${CLASS_NAME}`))));
    }
  }

  return [];
}

function getLeaveSelectorsFromAnimations(
  ...animations: Array<AnimationTriggerMetadata>
): Array<string> {
  const selectors = animations
    .flatMap((a) => a.definitions)
    .filter((am): am is AnimationTransitionMetadata => am.type === AnimationMetadataType.Transition)
    .filter((am) => am.expr === ':leave')
    .flatMap((am: AnimationTransitionMetadata) =>
      Array.isArray(am.animation)
        ? am.animation.flatMap((am2) => parseLeaveAnimation(am2))
        : parseLeaveAnimation(am),
    );

  return selectors;
}

function isElementInViewport(el: Element) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.top <=
      (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */ &&
    rect.left <=
      (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
  );
}

function setVisible(el: Element) {
  if (isElementInViewport(el)) {
    el.classList.add(CLASS_NAME);
  }
}

export function addVisibleClassOnDestroy(...animations: Array<AnimationTriggerMetadata>) {
  const selector = getLeaveSelectorsFromAnimations(...animations).join(',');
  if (selector) {
    inject(DestroyRef).onDestroy(() => {
      document
        .querySelectorAll(selector)
        // eslint-disable-next-line unicorn/no-array-for-each
        .forEach((element) => setVisible(element));
    });
  }
}
