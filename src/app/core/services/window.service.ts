import { isPlatformBrowser } from '@angular/common';
import {
  ClassProvider,
  FactoryProvider,
  Injectable,
  InjectionToken,
  PLATFORM_ID,
} from '@angular/core';

import { WindowRef } from './native-window.service';

export const WINDOW = new InjectionToken('WindowToken');

@Injectable()
export class BrowserWindowRef extends WindowRef {
  override get nativeWindow(): Window | object {
    return window;
  }
}

export const windowFactory = (
  browserWindowRef: BrowserWindowRef,
  platformId: object,
): Window | object => {
  if (isPlatformBrowser(platformId)) {
    return browserWindowRef.nativeWindow;
  }

  return {};
};

const browserWindowProvider: ClassProvider = {
  provide: WindowRef,
  useClass: BrowserWindowRef,
};

const windowProvider: FactoryProvider = {
  provide: WINDOW,
  deps: [WindowRef, PLATFORM_ID],
  useFactory: windowFactory,
};

export const WINDOW_PROVIDERS = [browserWindowProvider, windowProvider];
