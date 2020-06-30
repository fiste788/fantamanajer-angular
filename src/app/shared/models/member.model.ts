import { Club, Player, Rating, Role, Season, Team } from './';

// tslint:disable: variable-name
export class Member {
  public id: number;
  public code_gazzetta: number;
  public active: boolean;
  public player_id: number;
  public role_id: number;
  public club_id: number;
  public season_id: number;
  public club: Club;
  public season: Season;
  public ratings: Array<Rating>;
  public player: Player;
  public role: Role;
  public teams: Array<Team>;
  public photo_url: string | null;
  public free?: boolean;
  public stats?: {
    avg_points: number,
    avg_rating: number,
    sum_goals: number,
    sum_goals_against: number,
  };
  public likely_lineup?: {
    regular: boolean;
    injured: boolean;
    disqualified: boolean;
    second_ballot: number;
  };
}
