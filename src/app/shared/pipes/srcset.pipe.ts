import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({
  name: 'srcset',
  standalone: true,
})
export class SrcsetPipe implements PipeTransform {

  public transform(
    sizes: Record<string, string> | string | null | undefined,
    isOnlyFirst = false,
    isOnlyKeys = false,
  ): string {
    if (sizes === undefined || sizes === null) {
      return '';
    }

    if (typeof sizes === 'string') {
      // If input is already a string, return it directly or based on flags
      if (isOnlyFirst || isOnlyKeys) {
        // Handle cases where flags are used with a string input if necessary
        // For now, assuming it returns the string itself
        return sizes;
      }

      return sizes;
    }

    // Handle Record<string, string> input
    const keys = this.#extractSizesFromRecord(sizes); // Extracted helper function
    const sortedKeys = this.#sortSizes(keys); // Extracted helper function
    const bigger = sortedKeys.at(-1);

    if (isOnlyKeys) {
      return `${sortedKeys.join('w, ')}w`;
    }

    if (isOnlyFirst) {
      const first = `${bigger}w`;

      return sizes[first]!;
    }

    // Generate the full srcset string from the record
    return this.#generateSrcsetString(sizes); // Extracted helper function
  }

  #extractSizesFromRecord(sizes: Record<string, string>): number[] {
    return Object.keys(sizes).map(size => +size.slice(0, -1));
  }

  #generateSrcsetString(sizes: Record<string, string>): string {
    return Object.entries(sizes)
      .map(([k, v]) => `${v} ${k}`)
      .join(',');
  }

  #sortSizes(keys: number[]): number[] {
    // eslint-disable-next-line unicorn/no-array-sort
    return keys.sort((a, b) => a - b);
  }

}
