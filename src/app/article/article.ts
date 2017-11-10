import { Team } from '../team/team';
import { Matchday } from '../matchday/matchday';

export class Article {
  id: number;
  title: string;
  subtitle: string;
  body: string;
  created_at: Date;
  team_id: number;
  matchday_id: number;
  team: Team;
  matchday: Matchday;
}
