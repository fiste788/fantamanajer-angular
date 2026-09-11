import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({
  name: 'range',
  standalone: true,
})
export class RangePipe implements PipeTransform {

  public transform(size = 0, start = 1, step = 1): number[] {
    const range: number[] = [];
    let count = start;
    for (let length = 0; length < size; length += 1) {
      range.push(count);
      count += step;
    }

    return range;
  }

}
