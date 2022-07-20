import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'srcset' })
export class SrcsetPipe implements PipeTransform {
  public transform(sizes: Record<string, string> | string | null): string {
    if (sizes !== null) {
      const srcset =
        typeof sizes !== 'string' ? Object.entries(sizes).map(([k, v]) => `${v} ${k}`) : [...sizes];

      return srcset.join(',');
    }

    return '';
  }
}
