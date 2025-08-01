import { Matchday } from './matchday.model';
import { Member } from './member.model';
import { Team } from './team.model';

// Modifica suggerita per la nomenclatura
export interface Transfer {
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
