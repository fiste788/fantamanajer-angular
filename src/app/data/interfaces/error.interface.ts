import type { Exception } from './exception.interface';
import type { Trace } from './trace.interface';

// Modifica suggerita per la nomenclatura
export interface ApiError {
  code: number;
  exception?: Exception;
  file?: string;
  line?: number;
  message: string;
  trace?: Trace[];
  url: string;
}
