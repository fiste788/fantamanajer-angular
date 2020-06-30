import { IPagination } from './';

export interface IPagedResponse<T> {
  pagination: IPagination;
  data: T;
}
