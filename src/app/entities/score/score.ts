import { Matchday } from '../matchday/matchday';
import { Team } from '../team/team';
import { Lineup } from '../lineup/lineup';

export class Score {
  id: number;
  points: number;
  real_points: number;
  penaliy_points: number;
  penality: string;
  matchday_id: number;
  team_id: number;
  lineup_id: number;
  lineup: Lineup;
  matchday: Matchday;
  team: Team;
}
