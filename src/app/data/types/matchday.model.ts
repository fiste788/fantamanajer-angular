import { Season } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export class Matchday {
  public id: number;
  public number: number;
  public date: Date;
  public season_id: number;
  public season: Season;
}
