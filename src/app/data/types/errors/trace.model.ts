export interface Trace {
  file: string;
  line: number;
  function: string;
  class: string;
  type: string;
  args?: Record<string, unknown>;
}
