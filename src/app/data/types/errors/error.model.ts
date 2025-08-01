import { Exception } from './exception.model';
import { Trace } from './trace.model';

// Modifica suggerita per la nomenclatura
export interface ApiError {
  message: string;
  url: string;
  code: number;
  file?: string;
  line?: number;
  exception?: Exception;
  trace?: Array<Trace>;
}
