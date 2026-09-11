import type { Matchday } from './matchday.interface';
import type { Member } from './member.interface';
import type { Team } from './team.interface';

// Modifica suggerita per la nomenclatura
export interface Transfer {
  constrained: boolean;
  id: number;
  matchday: Matchday;
  matchday_id: number;
  new_member: Member;
  new_member_id: number | undefined;
  old_member: Member;
  old_member_id: number | undefined;
  team: Team;
  team_id: number;
}
