import { Score } from './score.model';
import { Team } from './team.model';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface RankingPosition {
  scores?: {
    [key: number]: Partial<Score>;
  };
  sum_points: number;
  team: Team;
  team_id: number;
}
