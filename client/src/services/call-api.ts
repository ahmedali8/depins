import client from "@/config/axios";
import type { Methods } from "@/constants";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

type NetworkRequestOptions<TRequest = any> = AxiosRequestConfig & {
  data?: TRequest /* POST, PUT requests */;
};

export type NetworkRequestParams<TRequest = any> = {
  url: string;
  method: Methods;
  options?: NetworkRequestOptions<TRequest>;
};

export const networkRequest = async <any, TRequest = any>(
  params: NetworkRequestParams<TRequest>
): Promise<AxiosResponse<any>> => {
  const { method, url, options = {} } = params || {};

  try {
    const response = await client.request<any>({
      method,
      url,
      ...options,
    });

    return response.data;
  } catch (error: any) {
    console.error(`Network request failed: ${method} ${url}`, error);
    throw error;
  }
};
