import { Season } from '../season/season';

export class Matchday {
  id: number;
  number: number;
  date: Date;
  season_id: number;
  season: Season;
}
