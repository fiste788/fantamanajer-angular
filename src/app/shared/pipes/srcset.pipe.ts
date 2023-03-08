import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'srcset',
  standalone: true,
})
export class SrcsetPipe implements PipeTransform {
  public transform(sizes: Record<string, string> | string | null): string {
    if (sizes !== null) {
      const srcset =
        typeof sizes === 'string' ? [...sizes] : Object.entries(sizes).map(([k, v]) => `${v} ${k}`);

      return srcset.join(',');
    }

    return '';
  }
}
