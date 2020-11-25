import { Pagination } from './';

export interface PagedResponse<T> {
  pagination: Pagination;
  data: T;
}
