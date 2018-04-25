import { Pagination } from './pagination';

export class PagedResponse<T> {
    pagination: Pagination;
    data: T;
}
