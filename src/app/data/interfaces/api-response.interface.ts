import { Pagination } from './pagination';

export interface ApiResponse {
  data: Record<string, unknown>;
  success: boolean;
  pagination?: Pagination;
}
