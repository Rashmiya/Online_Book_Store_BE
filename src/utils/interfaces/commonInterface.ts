export interface ApiResponse<T> {
  [x: string]: any;
  success: boolean;
  message: string;
  data: T | null;
}
