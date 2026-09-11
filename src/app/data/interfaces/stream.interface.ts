import { StreamActivity } from './stream-activity.model';

export interface Stream {
  duration: string;
  next: string;
  unread: number;
  unseen: number;
  results: Array<StreamActivity>;
}
