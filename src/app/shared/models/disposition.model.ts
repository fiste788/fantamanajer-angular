import { Lineup, Member } from './';

// tslint:disable: variable-name
export class Disposition {
  id: number;
  position: number;
  consideration: number;
  lineup_id: number;
  member_id: number | null;
  lineup: Lineup;
  member: Member | null;
}
