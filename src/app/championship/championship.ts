import { League } from '../league/league';
import { Season } from '../season/season';
import { Team } from '../team/team'

export class Championship {
  id: number;
  teams: Team[];
  league: League;
  season: Season;
}
