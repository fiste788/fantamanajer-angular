import { Season } from './season.model';

export interface Matchday {
  id: number;
  number: number;
  date: Date;
  season_id: number;
  season: Season;
}
