declare global {
  interface Window {
    addEventListener(
      type: 'beforeinstallprompt',
      listener: (this: Window, ev: BeforeInstallPromptEvent) => void,
      options?: AddEventListenerOptions | boolean,
    ): void;
  }
}

export abstract class WindowRef {
  get nativeWindow(): Window | object {
    throw new Error('Not implemented.');
  }
}
