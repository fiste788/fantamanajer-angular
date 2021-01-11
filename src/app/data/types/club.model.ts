import { Member } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export class Club {
  public id: number;
  public name: string;
  public partitive: string;
  public determinant: string;
  public members: Array<Member>;
  public photo_url: string | null;
  public background_url: Record<string, string> | null;
}
