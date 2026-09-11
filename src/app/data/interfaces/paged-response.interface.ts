import type { Pagination } from './pagination.interface';

export interface PagedResponse<T> {
  data: T;
  pagination: Pagination;
}
