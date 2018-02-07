import { Lineup } from '../lineup/lineup';
import { Member } from '../member/member';

export class Disposition {
  id: number;
  position: number;
  consideration: number;
  lineup_id: number;
  member_id: number;
  lineup: Lineup;
  member: Member;
}
