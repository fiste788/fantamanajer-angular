import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'srcset' })
export class SrcsetPipe implements PipeTransform {
  public transform(sizes: Record<string, string> | string | null): string {
    if (sizes !== null) {
      const srcset = [];
      if (typeof sizes !== 'string') {
        const keys = Object.keys(sizes);
        keys.forEach((key) => {
          srcset.push(`${sizes[key]} ${key}`);
        });
      } else {
        srcset.push(sizes);
      }

      return srcset.join(',');
    }

    return '';
  }
}
