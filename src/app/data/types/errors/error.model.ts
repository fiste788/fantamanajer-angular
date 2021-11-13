import { Exception } from './exception.model';
import { Trace } from './trace.model';

export interface Error {
  message: string;
  url: string;
  code: number;
  file?: string;
  line?: number;
  exception?: Exception;
  trace?: Array<Trace>;
}
