import { Matchday } from '../matchday/matchday';
import { Member } from '../member/member';
import { Team } from '../team/team';

export class Transfert {
  id: number;
  team_id: number;
  matchday_id: number;
  constrained: boolean;
  old_member_id: number;
  new_member_id: number;
  team: Team;
  matchday: Matchday;
  old_member: Member;
  new_member: Member;
}
