import type { League } from './league.interface';
import type { Season } from './season.interface';
import type { Team } from './team.interface';

export interface Championship {
  captain: boolean;
  captain_missed_lineup: boolean;
  id: number;
  jolly: boolean;
  league: League;
  league_id: number;
  minute_lineup: number;
  number_benchwarmers: number;
  number_selections: number;
  number_substitutions: number;
  number_transferts: number;
  points_missed_lineup: number;
  season: Season;
  season_id: number;
  started: boolean;
  teams: Team[];
}
