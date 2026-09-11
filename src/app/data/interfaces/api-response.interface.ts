import type { Pagination } from './pagination.interface';

export interface ApiResponse {
  data: Record<string, unknown>;
  pagination?: Pagination;
  success: boolean;
}
