import type { Club } from './club.interface';
import type { Player } from './player.interface';
import type { Rating } from './rating.interface';
import type { Role } from './role.interface';
import type { Season } from './season.interface';
import type { Team } from './team.interface';

export interface Member {
  active: boolean;
  club: Club;
  club_id: number;
  code_gazzetta: number;
  free?: boolean;
  id: number;
  likely_lineup?:
    | {
      disqualified: boolean;
      injured: boolean;
      regular: boolean;
      second_ballot: number;
      versus: string;
    }
    | undefined;
  photo_url: string | null;
  player: Player;
  player_id: number;
  ratings: Rating[];
  role: Role;
  role_id: number;
  season: Season;
  season_id: number;
  stats?: {
    avg_points: number;
    avg_rating: number;
    sum_goals: number;
    sum_goals_against: number;
    sum_present: number;
    sum_red_card: number;
    sum_yellow_card: number;
  };
  teams: Team[];
}
