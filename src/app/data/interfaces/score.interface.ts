import type { Lineup } from './lineup.interface';
import type { Matchday } from './matchday.interface';
import type { Team } from './team.interface';

export interface Score {
  id: number;
  lineup?: Lineup;
  lineup_id: number;
  matchday: Matchday;
  matchday_id: number;
  penality: string | null;
  penality_points: number;
  points: number;
  real_points: number;
  team: Team;
  team_id: number;
}
