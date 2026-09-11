export interface Trace {
  args?: Record<string, unknown>;
  class: string;
  file: string;
  function: string;
  line: number;
  type: string;
}
