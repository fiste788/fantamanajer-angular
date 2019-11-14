import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@env/environment';

@Pipe({ name: 'cdi' })
export class ClubDefaultImagePipe implements PipeTransform {
  transform(id: number): string {
    if (id) {
      return environment.apiEndpoint + 'img/Clubs/' + id + '/primitive/' + id + '.svg';
    } else {
      return '';
    }
  }
}
