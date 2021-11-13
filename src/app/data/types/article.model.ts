import { Matchday, Team } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface Article {
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
