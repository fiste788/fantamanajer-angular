import { Team } from './';

export class Event {
  id: number;
  created_at: Date;
  team_id: number;
  type: number;
  external: number;
  title: string;
  body: string;
  icon: string;
  team: Team;
}
