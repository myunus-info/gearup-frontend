export interface IApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data?: T;
}

export type ApiResponse<T = any> = IApiResponse<T>;

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
}
