import { Matchday, Member, Team } from './';

// tslint:disable: variable-name
export class Selection {
  id: number;
  active: boolean;
  team_id: number;
  matchday_id: number;
  old_member_id: number;
  new_member_id: number;
  team: Team;
  matchday: Matchday;
  old_member: Member;
  new_member: Member;
}
