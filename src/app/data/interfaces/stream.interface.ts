import type { StreamActivity } from './stream-activity.interface';

export interface Stream {
  duration: string;
  next: string;
  results: StreamActivity[];
  unread: number;
  unseen: number;
}
