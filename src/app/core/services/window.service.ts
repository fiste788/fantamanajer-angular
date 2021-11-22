import { isPlatformBrowser } from '@angular/common';
import {
  ClassProvider,
  FactoryProvider,
  Injectable,
  InjectionToken,
  PLATFORM_ID,
} from '@angular/core';

declare global {
  interface Window {
    addEventListener(
      type: 'beforeinstallprompt',
      listener: (this: Window, ev: BeforeInstallPromptEvent) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;
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

  return new Object();
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
