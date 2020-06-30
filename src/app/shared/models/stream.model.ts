import { StreamActivity } from './';

export class Stream {
  public duration: string;
  public next: string;
  public unread: number;
  public unseen: number;
  public results: Array<StreamActivity>;
}
