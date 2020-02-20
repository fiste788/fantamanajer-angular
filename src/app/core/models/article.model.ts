import { Matchday, Team } from './';

// tslint:disable: variable-name
export class Article {
  id: number;
  title: string;
  subtitle: string;
  body: string;
  created_at: Date;
  modified_at: Date | null;
  team_id: number;
  matchday_id: number;
  team: Team;
  matchday: Matchday;
}
