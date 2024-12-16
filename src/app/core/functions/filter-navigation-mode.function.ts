import { filter, map, ObservableInput, pipe, withLatestFrom } from 'rxjs';

export function filterNavigationMode<T>(obs: ObservableInput<string>, val = 'bar') {
  return pipe(
    withLatestFrom<T, Array<string>>(obs),
    filter((mode) => mode[1] === val),
    map(([dir]) => dir),
  );
}
