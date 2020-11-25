import { Matchday, Team } from './';

// tslint:disable: variable-name naming-convention
export class Article {
  public id: number;
  public title: string;
  public subtitle: string;
  public body: string;
  public created_at: Date;
  public modified_at: Date | null;
  public team_id: number;
  public matchday_id: number;
  public team: Team;
  public matchday: Matchday;
}
