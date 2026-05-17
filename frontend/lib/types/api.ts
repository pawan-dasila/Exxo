export interface ApiResponse<T> {
  status_code: number;
  message: string;
  data: T;
}

export interface ApiError {
  status_code: number;
  message: string;
  data: {
    errorCode?: string;
    details?: Record<string, string[]>;
  };
}
