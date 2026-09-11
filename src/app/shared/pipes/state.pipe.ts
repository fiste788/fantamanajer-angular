import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { RouterOutlet } from '@angular/router';

@Pipe({
  name: 'state',
  standalone: true,
})
export class StatePipe implements PipeTransform {

  public transform(routerOutlet?: RouterOutlet): string {
    return routerOutlet?.activatedRouteData['state'] as string;
  }

}
