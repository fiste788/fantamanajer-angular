import { Lineup } from './lineup.model';
import { Member } from './member.model';
/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface Disposition {
  id: number;
  position: number;
  consideration: number;
  lineup_id: number;
  member_id: number | null;
  lineup: Lineup;
  member?: Member;
}
