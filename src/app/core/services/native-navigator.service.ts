declare global {
  export interface Navigator {
    setAppBadge?(count?: number): void;
    clearAppBadge?(): void;
  }
}

export abstract class NavigatorRef {
  get nativeNavigator(): Navigator | object {
    throw new Error('Not implemented.');
  }
}
