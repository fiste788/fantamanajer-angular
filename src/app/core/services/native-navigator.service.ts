declare global {
  interface Navigator {
    windowControlsOverlay?: WindowControlsOverlay;
  }
}

export abstract class NavigatorReference {

  public get nativeNavigator(): Navigator | object {
    throw new Error('Not implemented.');
  }

}
