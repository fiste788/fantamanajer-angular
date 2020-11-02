import { Season } from './';

// tslint:disable: variable-name naming-convention
export class Matchday {
  public id: number;
  public number: number;
  public date: Date;
  public season_id: number;
  public season: Season;
}
