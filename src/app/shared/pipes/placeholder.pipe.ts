import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'placeholder',
  standalone: true,
})
export class PlaceholderPipe implements PipeTransform {
  public opts = {
    bgcolor: '#ccc',
    color: '#969696',
    ffamily: 'arial',
    fsize: '32',
    fstyle: 'normal',
    fweight: 'bold',
    size: '512x256',
    text: 'Hello World',
  };

  public transform(size: string, text: string): string {
    this.opts.text = text;
    this.opts.size = size;

    return '';
  }
}
