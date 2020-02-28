import { BREAKPOINT } from '@angular/flex-layout';

const PRINT_BREAKPOINTS = [{
  alias: 'xxs',
  suffix: 'Xxs',
  mediaQuery: '(max-width: 297px)',
  overlapping: false
}];

export const CUSTOM_BREAKPOINT_PROVIDER = {
  provide: BREAKPOINT,
  useValue: PRINT_BREAKPOINTS,
  multi: true
};
