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
    // Tipizzazione corretta: emette un array [valore_sorgente, ultimo_valore_di_obs]
    withLatestFrom<T, Array<string>>(obs),
    // Utilizza i nomi delle variabili nel filter
    filter(([latestMode]) => latestMode === val),
    // Utilizza i nomi delle variabili nel map
    map(([originalValue]) => originalValue),
  );
}
