import { Club } from '../club/club';
import { Rating } from '../rating/rating';
import { Season } from '../season/season';
import { Player } from '../player/player';

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
}
