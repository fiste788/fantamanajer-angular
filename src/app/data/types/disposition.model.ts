import { Lineup, Member } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export class Disposition {
  public id: number;
  public position: number;
  public consideration: number;
  public lineup_id: number;
  public member_id: number | null;
  public lineup: Lineup;
  public member: Member | null;
}
