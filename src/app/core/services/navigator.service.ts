import { isPlatformBrowser } from '@angular/common';
import { ClassProvider, FactoryProvider, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';

declare global {
  // tslint:disable-next-line: interface-name
  export interface Navigator {
    setAppBadge?(count?: number): void;
    clearAppBadge?(): void;
  }
}

export const NAVIGATOR = new InjectionToken('NavigatorToken');

export abstract class NavigatorRef {

  get nativeNavigator(): Navigator | object {
    throw new Error('Not implemented.');
  }
}

@Injectable()
export class BrowserNavigatorRef extends NavigatorRef {

  get nativeNavigator(): Navigator | object {
    return navigator;
  }
}

export const navigatorFactory = (browserNavigatorRef: BrowserNavigatorRef, platformId: object): Navigator | object => {
  if (isPlatformBrowser(platformId)) {
    return browserNavigatorRef.nativeNavigator;
  }

  return new Object();
};

const browserNavigatorProvider: ClassProvider = {
  provide: NavigatorRef,
  // tslint:disable-next-line: object-literal-sort-keys
  useClass: BrowserNavigatorRef,
};

const navigatorProvider: FactoryProvider = {
  provide: NAVIGATOR,
  // tslint:disable-next-line: object-literal-sort-keys
  useFactory: navigatorFactory,
  deps: [NavigatorRef, PLATFORM_ID],
};

export const NAVIGATOR_PROVIDERS = [
  browserNavigatorProvider,
  navigatorProvider,
];