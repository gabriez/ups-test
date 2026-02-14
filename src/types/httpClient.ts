import type { AxiosRequestConfig } from "axios";

export interface HttpClient {
  post<T>(uri: string, body: unknown, options?: AxiosRequestConfig): Promise<ResponseHttp<T>>;
}
export interface ResponseHttp<T> {
  data: T;
  status: number;
  statusText: string;
}
