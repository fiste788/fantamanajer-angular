import { Score } from './score.model';
import { Team } from './team.model';

export interface RankingPosition {
  scores?: Record<number, Partial<Score>>;
  sum_points: number;
  team: Team;
  team_id: number;
}
