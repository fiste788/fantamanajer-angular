import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'srcset',
  standalone: true,
})
export class SrcsetPipe implements PipeTransform {
  public transform(
    sizes: Record<string, string> | string | null | undefined,
    onlyFirst = false,
    onlyKeys = false,
  ): string {
    if (sizes === undefined || sizes === null) {
      return '';
    }

    if (typeof sizes === 'string') {
      // If input is already a string, return it directly or based on flags
      if (onlyFirst || onlyKeys) {
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

    if (onlyKeys) {
      return `${sortedKeys.join('w, ')}w`;
    }

    if (onlyFirst) {
      const first = `${bigger}w`;

      return sizes[first]!;
    }

    // Generate the full srcset string from the record
    return this.#generateSrcsetString(sizes); // Extracted helper function
  }

  #extractSizesFromRecord(sizes: Record<string, string>): Array<number> {
    return Object.keys(sizes).map((size) => +size.slice(0, -1));
  }

  #sortSizes(keys: Array<number>): Array<number> {
    return keys.sort((a, b) => a - b);
  }

  #generateSrcsetString(sizes: Record<string, string>): string {
    return Object.entries(sizes)
      .map(([k, v]) => `${v} ${k}`)
      .join(',');
  }
}
