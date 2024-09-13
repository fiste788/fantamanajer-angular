import { Team } from './team.model';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface RollOfHonor {
  roll_of_honor: Array<{ rank: number; points: number; team: Team; team_id: number }>;
}
