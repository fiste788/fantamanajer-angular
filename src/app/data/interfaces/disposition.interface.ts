import type { Lineup } from './lineup.interface';
import type { Member } from './member.interface';

export interface Disposition {
  consideration: number;
  id: number;
  lineup: Lineup;
  lineup_id: number;
  member?: Member | undefined;
  member_id: number | null;
  position: number;
}
