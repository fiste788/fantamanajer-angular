import type { Score } from './score.interface';
import type { Team } from './team.interface';

export interface RankingPosition {
  scores?: Record<number, Partial<Score>>;
  sum_points: number;
  team: Team;
  team_id: number;
}
