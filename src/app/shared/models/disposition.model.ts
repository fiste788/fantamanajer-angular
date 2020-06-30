import { Lineup, Member } from './';

// tslint:disable: variable-name
export class Disposition {
  public id: number;
  public position: number;
  public consideration: number;
  public lineup_id: number;
  public member_id: number | null;
  public lineup: Lineup;
  public member: Member | null;
}
