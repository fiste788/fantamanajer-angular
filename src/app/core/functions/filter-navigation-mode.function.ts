import {
  filter,
  map,
  Observable,
  ObservableInput,
  pipe,
  UnaryFunction,
  withLatestFrom,
} from 'rxjs';

export function filterNavigationMode<T>(
  obs: ObservableInput<string>,
  val = 'bar',
): UnaryFunction<Observable<T>, Observable<T>> {
  return pipe(
    withLatestFrom<T, Array<string>>(obs),
    filter((mode) => mode[1] === val),
    map(([dir]) => dir),
  );
}
