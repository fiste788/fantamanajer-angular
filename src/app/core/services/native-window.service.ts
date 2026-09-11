declare global {
  interface Window {
    addEventListener(
      type: 'beforeinstallprompt',
      listener: (this: Window, event: BeforeInstallPromptEvent) => void,
      options?: AddEventListenerOptions | boolean,
    ): void;
  }
}

export abstract class WindowReference {

  public get nativeWindow(): object | Window {
    throw new Error('Not implemented.');
  }

}
