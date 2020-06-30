import { isPlatformBrowser } from '@angular/common';
import { ClassProvider, FactoryProvider, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';

declare global {
  // tslint:disable-next-line: interface-name
  interface Window {
    addEventListener(
      type: 'beforeinstallprompt',
      // tslint:disable-next-line: no-any
      listener: (this: Window, ev: BeforeInstallPromptEvent) => any, options?: boolean | AddEventListenerOptions): void;
  }
}

export const WINDOW = new InjectionToken('WindowToken');

export abstract class WindowRef {

  get nativeWindow(): Window | object {
    throw new Error('Not implemented.');
  }
}

@Injectable()
export class BrowserWindowRef extends WindowRef {

  get nativeWindow(): Window | object {
    return window;
  }
}

export const windowFactory = (browserWindowRef: BrowserWindowRef, platformId: object): Window | object => {
  if (isPlatformBrowser(platformId)) {
    return browserWindowRef.nativeWindow;
  }

  return new Object();
};

const browserWindowProvider: ClassProvider = {
  provide: WindowRef,
  // tslint:disable-next-line: object-literal-sort-keys
  useClass: BrowserWindowRef,
};

const windowProvider: FactoryProvider = {
  provide: WINDOW,
  // tslint:disable-next-line: object-literal-sort-keys
  deps: [WindowRef, PLATFORM_ID],
  useFactory: windowFactory,
};

export const WINDOW_PROVIDERS = [
  browserWindowProvider,
  windowProvider,
];
