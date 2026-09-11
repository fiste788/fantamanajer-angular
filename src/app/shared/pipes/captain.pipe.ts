import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

import type { Lineup } from '@data/interfaces';

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
