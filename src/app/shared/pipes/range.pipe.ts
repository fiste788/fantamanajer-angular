
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {
  transform(length: number, offset = 0): Array<number> {
    if (!length) {
      return [];
    }
    const array = [];
    for (let n = 0; n < length; n += 1) {
      array.push(offset + n);
    }

    return array;
  }
}
