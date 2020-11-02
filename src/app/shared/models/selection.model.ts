import { Matchday, Member, Team } from './';

// tslint:disable: variable-name naming-convention
export class Selection {
  public id: number;
  public active: boolean;
  public team_id: number;
  public matchday_id: number;
  public old_member_id: number;
  public new_member_id: number;
  public team: Team;
  public matchday: Matchday;
  public old_member: Member | null;
  public new_member: Member | null;
}
