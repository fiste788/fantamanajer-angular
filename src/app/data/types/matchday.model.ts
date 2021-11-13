import { Season } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface Matchday {
  id: number;
  number: number;
  date: Date;
  season_id: number;
  season: Season;
}
