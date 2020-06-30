import { Member } from './';

// tslint:disable: variable-name
export class Player {
  public id: number;
  public name: string | null;
  public surname: string;
  public members: Array<Member>;
  public full_name: string;
  public photo_url: string | null;
}
