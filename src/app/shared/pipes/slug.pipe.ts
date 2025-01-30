import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slug',
  standalone: true,
})
export class SlugPipe implements PipeTransform {
  public transform(input: string): string {
    return input
      .toString()
      .toLowerCase()
      .replaceAll(/\s+/g, '-') // Replace spaces with -
      .replaceAll(/[^\w-]+/g, '') // Remove all non-word chars
      .replaceAll(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }
}
