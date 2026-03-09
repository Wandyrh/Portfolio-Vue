export interface ApiResult<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  totalPages: number;
  pageSize: number;
}