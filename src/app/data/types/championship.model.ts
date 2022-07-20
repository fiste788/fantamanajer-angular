import { League } from './league.model';
import { Season } from './season.model';
import { Team } from './team.model';
/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface Championship {
  id: number;
  started: boolean;
  captain: boolean;
  captain_missed_lineup: boolean;
  points_missed_lineup: number;
  minute_lineup: number;
  number_substitutions: number;
  number_benchwarmers: number;
  number_selections: number;
  number_transferts: number;
  jolly: boolean;
  season_id: number;
  league_id: number;
  teams: Array<Team>;
  league: League;
  season: Season;
}
