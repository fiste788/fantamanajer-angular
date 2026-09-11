import type { Disposition } from './disposition.interface';
import type { Matchday } from './matchday.interface';
import type { Member } from './member.interface';
import type { Team } from './team.interface';

export interface Lineup {
  captain: Member | null;
  captain_id: number | null;
  created_at: Date;
  dispositions: Disposition[];
  id: number;
  jolly: boolean;
  matchday: Matchday;
  matchday_id: number;
  modified_at: Date | null;
  module: string | undefined;
  modules: string[];
  team: Team;
  team_id: number;
  vcaptain: Member | null;
  vcaptain_id: number | null;
  vvcaptain: Member | null;
  vvcaptain_id: number | null;
}
