import { Matchday } from '../matchday/matchday';
import { Member } from '../member/member';

export class Transfert {
  id: number;
  matchday_id: number;
  contraint: boolean;
  old_member_id: number;
  new_member_id: number;
  matchday: Matchday;
  old_member: Member;
  new_member: Member;
}
