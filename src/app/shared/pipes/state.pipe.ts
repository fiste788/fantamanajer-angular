import { Pipe, PipeTransform } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Pipe({
  name: 'state',
  standalone: true,
})
export class StatePipe implements PipeTransform {
  public transform(routerOutlet?: RouterOutlet): string {
    return routerOutlet?.activatedRouteData['state'] as string;
  }
}
