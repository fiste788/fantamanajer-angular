import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'srcset',
  standalone: true,
})
export class SrcsetPipe implements PipeTransform {
  public transform(
    sizes: Record<string, string> | string | null,
    onlyFirst = false,
    onlyKeys = false,
  ): string {
    if (sizes !== null) {
      const keys = Object.keys(sizes).map((size) => +size.slice(0, -1));
      const bigger = keys.sort((a, b) => a - b).at(-1);
      if (onlyKeys) {
        return `${keys.join('w, ')}w`;
      }

      if (onlyFirst) {
        if (typeof sizes === 'string') {
          return sizes;
        }
        const first = `${bigger}w`;

        return sizes[first]!;
      }

      const srcset =
        typeof sizes === 'string' ? [...sizes] : Object.entries(sizes).map(([k, v]) => `${v} ${k}`);

      return srcset.join(',');
    }

    return '';
  }
}
