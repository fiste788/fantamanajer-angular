import { Pagination } from './';

export class PagedResponse<T> {
    pagination: Pagination;
    data: T;
}
