import { Lineup, Matchday, Team } from './';

// tslint:disable: variable-name
export class Score {
  public id: number;
  public points: number;
  public real_points: number;
  public penality_points: number;
  public penality: string | null;
  public matchday_id: number;
  public team_id: number;
  public lineup_id: number;
  public lineup: Lineup;
  public matchday: Matchday;
  public team: Team;
}
