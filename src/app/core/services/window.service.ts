import { isPlatformBrowser } from '@angular/common';
import type { ClassProvider, FactoryProvider } from '@angular/core';
import { InjectionToken, PLATFORM_ID, Service } from '@angular/core';

import { WindowReference } from './native-window.service';

@Service()
export class BrowserWindowReference extends WindowReference {

  public override get nativeWindow(): object | Window {
    return globalThis;
  }

}

export const WINDOW = new InjectionToken('WindowToken');
const browserWindowProvider: ClassProvider = {
  provide: WindowReference,
  useClass: BrowserWindowReference,
};

const windowFactory = (browserWindowReference: BrowserWindowReference, platformId: object): object | Window => {
  if (isPlatformBrowser(platformId)) {
    return browserWindowReference.nativeWindow;
  }

  return {};
};

const windowProvider: FactoryProvider = {
  deps: [WindowReference, PLATFORM_ID],
  provide: WINDOW,
  useFactory: windowFactory,
};

export const WINDOW_PROVIDERS = [browserWindowProvider, windowProvider];
