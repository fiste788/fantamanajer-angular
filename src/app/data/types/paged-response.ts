import { Pagination } from './pagination';

export interface PagedResponse<T> {
  pagination: Pagination;
  data: T;
}
