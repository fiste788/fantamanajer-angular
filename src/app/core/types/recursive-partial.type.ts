export type RecursivePartial<T> = T extends object
  ? { [K in keyof T]?: RecursivePartial<T[K]> }
  : T;
