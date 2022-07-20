import { Lineup } from './lineup.model';
import { Matchday } from './matchday.model';
import { Team } from './team.model';
/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface Score {
  id: number;
  points: number;
  real_points: number;
  penality_points: number;
  penality: string | null;
  matchday_id: number;
  team_id: number;
  lineup_id: number;
  lineup?: Lineup;
  matchday: Matchday;
  team: Team;
}
