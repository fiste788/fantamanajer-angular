import {
  filter,
  map,
  pipe,
  withLatestFrom,
} from 'rxjs';
import type {
  Observable,
  ObservableInput,
  UnaryFunction,
} from 'rxjs';

export function filterNavigationMode<T>(
  obs: ObservableInput<string>,
  value = 'bar',
): UnaryFunction<Observable<T>, Observable<T>> {
  return pipe(
    // Tipizzazione corretta: emette un array [valore_sorgente, ultimo_valore_di_obs]
    withLatestFrom<T, string[]>(obs),
    // Utilizza i nomi delle variabili nel filter
    filter(([latestMode]) => latestMode === value),
    // Utilizza i nomi delle variabili nel map
    map(([originalValue]) => originalValue),
  );
}
