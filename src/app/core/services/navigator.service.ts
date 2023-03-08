import { isPlatformBrowser } from '@angular/common';
import {
  ClassProvider,
  FactoryProvider,
  Injectable,
  InjectionToken,
  PLATFORM_ID,
} from '@angular/core';

import { NavigatorRef } from './native-navigator.service';

@Injectable({ providedIn: 'root' })
export class BrowserNavigatorRef extends NavigatorRef {
  override get nativeNavigator(): Navigator | object {
    return navigator;
  }
}

const navigatorFactory = (
  browserNavigatorRef: BrowserNavigatorRef,
  platformId: object,
): Navigator | object => {
  if (isPlatformBrowser(platformId)) {
    return browserNavigatorRef.nativeNavigator;
  }

  return {};
};
const browserNavigatorProvider: ClassProvider = {
  provide: NavigatorRef,
  useClass: BrowserNavigatorRef,
};
export const NAVIGATOR = new InjectionToken('NavigatorToken');
const navigatorProvider: FactoryProvider = {
  provide: NAVIGATOR,
  useFactory: navigatorFactory,
  deps: [NavigatorRef, PLATFORM_ID],
};

export const NAVIGATOR_PROVIDERS = [browserNavigatorProvider, navigatorProvider];
