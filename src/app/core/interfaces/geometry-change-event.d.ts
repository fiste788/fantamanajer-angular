/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 */
interface WindowControlsOverlayGeometryChangeEvent extends Event {
  getTitlebarAreaRect(): DOMRect;

  visible: boolean;
}

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 */
interface WindowControlsOverlay extends EventTarget {
  getTitlebarAreaRect(): DOMRect;

  visible: boolean;

  addEventListener(
    type: 'geometrychange',
    callback: (this: WindowControlsOverlay, ev: WindowControlsOverlayGeometryChangeEvent) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  addEventListener(
    type: string,
    listener: EventListener | EventListenerObject,
    options?: AddEventListenerOptions | boolean,
  ): void;
}
