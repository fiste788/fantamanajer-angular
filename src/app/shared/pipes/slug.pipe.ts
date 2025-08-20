import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slug',
  standalone: true,
})
export class SlugPipe implements PipeTransform {
  // Renamed parameter for clarity
  public transform(value: string): string {
    return (
      value
        .toString()
        .toLowerCase()
        // Replace spaces with -
        .replaceAll(/\s+/g, '-')
        // Remove all non-word chars
        .replaceAll(/[^\w-]+/g, '')
        // Replace multiple - with single -
        .replaceAll(/--+/g, '-')
        // Trim - from start of text
        .replace(/^-+/, '')
        // Trim - from end of text
        .replace(/-+$/, '')
    );
  }
}
