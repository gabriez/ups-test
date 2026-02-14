import { HttpClient, ResponseHttp } from "#types/httpClient.js";
import axios, { AxiosRequestConfig } from "axios";

class AxiosHttpClient implements HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async post<T>(uri: string, body: unknown, options?: AxiosRequestConfig): Promise<ResponseHttp<T>> {
    const { data, status, statusText } = await axios.post<T>(`${this.baseUrl}${uri}`, body, options);
    return { data, status, statusText };
  }
}

export default AxiosHttpClient;
