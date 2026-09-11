import type { Season } from './season.interface';

export interface Matchday {
  date: Date;
  id: number;
  number: number;
  season: Season;
  season_id: number;
}
