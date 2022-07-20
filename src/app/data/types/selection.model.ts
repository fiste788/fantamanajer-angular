import { Matchday } from './matchday.model';
import { Member } from './member.model';
import { Team } from './team.model';
/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface Selection {
  id: number;
  active: boolean;
  team_id: number;
  matchday_id: number;
  old_member_id: number;
  new_member_id: number;
  team: Team;
  matchday: Matchday;
  old_member: Member | null;
  new_member: Member | null;
}
