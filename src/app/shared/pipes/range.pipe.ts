import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range',
})
export class RangePipe implements PipeTransform {
  public transform(size = 0, start = 1, step = 1): Array<number> {
    const range: Array<number> = [];
    let count = start;
    for (let length = 0; length < size; length += 1) {
      range.push(count);
      count += step;
    }

    return range;
  }
}
