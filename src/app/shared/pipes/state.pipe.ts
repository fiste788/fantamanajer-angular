
import { Pipe, PipeTransform } from '@angular/core';

import { RouterOutlet } from '@angular/router';

@Pipe({
  name: 'state'
})
export class StatePipe implements PipeTransform {
  transform(routerOutlet?: RouterOutlet): string {
    return routerOutlet?.activatedRouteData?.state;
  }
}
