import type { Matchday } from './matchday.interface';
import type { Team } from './team.interface';

export interface Article {
  body: string;
  created_at: Date;
  id: number;
  matchday: Matchday;
  matchday_id: number;
  modified_at: Date | null;
  subtitle: string;
  team: Team;
  team_id: number;
  title: string;
}
