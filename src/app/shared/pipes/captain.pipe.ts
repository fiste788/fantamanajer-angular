import { Pipe, PipeTransform } from '@angular/core';

import { Lineup } from '@data/types';

@Pipe({
  name: 'captain',
  standalone: true,
})
export class CaptainPipe implements PipeTransform {
  public transform(memberId: number, lineup: Lineup): string {
    if (memberId === lineup.captain_id) {
      return 'C';
    }
    if (memberId === lineup.vcaptain_id) {
      return 'VC';
    }
    if (memberId === lineup.vvcaptain_id) {
      return 'VVC';
    }

    return '';
  }
}
