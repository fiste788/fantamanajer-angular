declare global {
  interface Navigator {
    windowControlsOverlay?: WindowControlsOverlay;
  }
}

export abstract class NavigatorRef {
  get nativeNavigator(): Navigator | object {
    throw new Error('Not implemented.');
  }
}
