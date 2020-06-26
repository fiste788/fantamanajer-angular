import { isPlatformBrowser } from '@angular/common';
import { ClassProvider, FactoryProvider, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';

export interface WkNavigator extends Navigator {
  setAppBadge?(count?: number): void;
  clearAppBadge?(): void;
}

export const NAVIGATOR = new InjectionToken('NavigatorToken');

export abstract class NavigatorRef {

  get nativeNavigator(): WkNavigator | Object {
    throw new Error('Not implemented.');
  }
}

@Injectable()
export class BrowserNavigatorRef extends NavigatorRef {

  get nativeNavigator(): WkNavigator | Object {
    return navigator;
  }
}

export const navigatorFactory = (browserNavigatorRef: BrowserNavigatorRef, platformId: Object): WkNavigator | Object => {
  if (isPlatformBrowser(platformId)) {
    return browserNavigatorRef.nativeNavigator;
  }

  return new Object();
};

const browserNavigatorProvider: ClassProvider = {
  provide: NavigatorRef,
  useClass: BrowserNavigatorRef
};

const navigatorProvider: FactoryProvider = {
  provide: NAVIGATOR,
  useFactory: navigatorFactory,
  deps: [NavigatorRef, PLATFORM_ID]
};

export const NAVIGATOR_PROVIDERS = [
  browserNavigatorProvider,
  navigatorProvider
];
