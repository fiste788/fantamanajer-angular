import { Lineup, Matchday, Team } from './';

// tslint:disable: variable-name
export class Score {
  id: number;
  points: number;
  real_points: number;
  penality_points: number;
  penality: string | null;
  matchday_id: number;
  team_id: number;
  lineup_id: number;
  lineup: Lineup;
  matchday: Matchday;
  team: Team;
}
