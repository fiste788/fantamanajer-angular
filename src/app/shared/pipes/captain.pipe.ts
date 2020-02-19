
import { Pipe, PipeTransform } from '@angular/core';
import { Lineup } from '@app/core/models';

@Pipe({
  name: 'captain'
})
export class CaptainPipe implements PipeTransform {
  transform(memberId: number, lineup: Lineup): string {
    if (memberId === lineup.captain_id) {
      return 'C';
    } else if (memberId === lineup.vcaptain_id) {
      return 'VC';
    } else if (memberId === lineup.vvcaptain_id) {
      return 'VVC';
    }

    return '';
  }
}
