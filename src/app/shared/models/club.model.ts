import { Member } from './';

// tslint:disable: variable-name naming-convention
export class Club {
  public id: number;
  public name: string;
  public partitive: string;
  public determinant: string;
  public members: Array<Member>;
  public photo_url: string | null;
  public background_url: {} | null;
}
