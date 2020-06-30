import { Matchday, Member, Team } from './';

// tslint:disable: variable-name
export class Transfert {
  public id: number;
  public team_id: number;
  public matchday_id: number;
  public constrained: boolean;
  public old_member_id: number;
  public new_member_id: number;
  public team: Team;
  public matchday: Matchday;
  public old_member: Member;
  public new_member: Member;
}
