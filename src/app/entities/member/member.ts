import { Club } from '../club/club';
import { Rating } from '../rating/rating';
import { Season } from '../season/season';
import { Player } from '../player/player';
import { Role } from '../role/role';
import { Team } from '../team/team';

export class Member {
  id: number;
  code_gazzetta: number;
  active: boolean;
  player_id: number;
  role_id: number;
  club_id: number;
  season_id: number;
  club: Club;
  season: Season;
  ratings: Rating[];
  player: Player;
  role: Role;
  teams: Team[];
  photo_url: string;
  free: boolean;
  stats: { string, number };
}
