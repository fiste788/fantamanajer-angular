import { isPlatformBrowser } from '@angular/common';
import { ClassProvider, FactoryProvider, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';

declare global {
  interface Window {
    addEventListener(
      type: 'beforeinstallprompt',
      // tslint:disable-next-line: no-any
      listener: (this: Window, ev: BeforeInstallPromptEvent) => any, options?: boolean | AddEventListenerOptions): void;
  }
}

export const WINDOW = new InjectionToken('WindowToken');

export abstract class WindowRef {

  get nativeWindow(): Window | Object {
    throw new Error('Not implemented.');
  }
}

@Injectable()
export class BrowserWindowRef extends WindowRef {

  get nativeWindow(): Window | Object {
    return window;
  }
}

export const windowFactory = (browserWindowRef: BrowserWindowRef, platformId: Object): Window | Object => {
  if (isPlatformBrowser(platformId)) {
    return browserWindowRef.nativeWindow;
  }

  return new Object();
};

const browserWindowProvider: ClassProvider = {
  provide: WindowRef,
  useClass: BrowserWindowRef
};

const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: windowFactory,
  deps: [WindowRef, PLATFORM_ID]
};

export const WINDOW_PROVIDERS = [
  browserWindowProvider,
  windowProvider
];
