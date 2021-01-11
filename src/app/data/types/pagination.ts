/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface Pagination {
  count: number;
  current_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  limit: number;
  page_count: number;
}
