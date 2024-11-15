import { Team } from './team.model';

export interface RollOfHonor {
  roll_of_honor: Array<{ rank: number; points: number; team: Team; team_id: number }>;
}
