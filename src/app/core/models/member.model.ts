import { Club, Player, Rating, Role, Season, Team } from './';

// tslint:disable: variable-name
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
  ratings: Array<Rating>;
  player: Player;
  role: Role;
  teams: Array<Team>;
  photo_url: string | null;
  free?: boolean;
  stats?: {
    avg_points: number,
    avg_rating: number,
    sum_goals: number,
    sum_goals_against: number
  };
  likely_lineup?: {
    regular: boolean;
    injured: boolean;
    disqualified: boolean;
    second_ballot: number;
  };
}
