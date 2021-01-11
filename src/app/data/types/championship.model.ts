import { League, Season, Team } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export class Championship {
  public id: number;
  public started: boolean;
  public captain: boolean;
  public captain_missed_lineup: boolean;
  public points_missed_lineup: number;
  public minute_lineup: number;
  public number_selections: number;
  public number_transferts: number;
  public jolly: boolean;
  public season_id: number;
  public league_id: number;
  public teams: Array<Team>;
  public league: League;
  public season: Season;
}
