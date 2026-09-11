import { Disposition } from './disposition.model';
import { Matchday } from './matchday.model';
import { Member } from './member.model';
import { Team } from './team.model';

export interface Lineup {
  id: number;
  module: string;
  modules: Array<string>;
  jolly: boolean;
  captain_id: number | null;
  vcaptain_id: number | null;
  vvcaptain_id: number | null;
  matchday_id: number;
  team_id: number;
  captain: Member | null;
  vcaptain: Member | null;
  vvcaptain: Member | null;
  matchday: Matchday;
  team: Team;
  dispositions: Array<Disposition>;
  modified_at: Date | null;
  created_at: Date;
}
