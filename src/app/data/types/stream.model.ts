import { StreamActivity } from './';

export interface Stream {
  duration: string;
  next: string;
  unread: number;
  unseen: number;
  results: Array<StreamActivity>;
}
