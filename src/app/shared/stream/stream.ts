import { StreamActivity } from './stream-activity';

export class Stream {
  duration: string;
  next: string;
  unread: number;
  unseen: number;
  results: StreamActivity[];
}
