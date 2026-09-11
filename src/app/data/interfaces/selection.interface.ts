import type { Matchday } from './matchday.interface';
import type { Member } from './member.interface';
import type { Team } from './team.interface';

export interface Selection {
  active: boolean;
  id: number;
  matchday: Matchday;
  matchday_id: number;
  new_member: Member | null;
  new_member_id: number;
  old_member: Member | null;
  old_member_id: number;
  team: Team;
  team_id: number;
}
