import { Club, Player, Rating, Role, Season, Team } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface Member {
  id: number;
  code_gazzetta: number;
  active: boolean;
  player_id: number;
  role_id: number;
  club_id: number;
  season_id: number;
  club: Club;
  season: Season;
  ratings: Array<Rating>;
  player: Player;
  role: Role;
  teams: Array<Team>;
  photo_url: string | null;
  free?: boolean;
  stats?: {
    avg_points: number;
    avg_rating: number;
    sum_goals: number;
    sum_goals_against: number;
    sum_present: number;
    sum_yellow_card: number;
    sum_red_card: number;
  };
  likely_lineup?: {
    versus: string;
    regular: boolean;
    injured: boolean;
    disqualified: boolean;
    second_ballot: number;
  };
}
