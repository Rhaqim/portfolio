import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { DEBTOURL } from '@/config';

const api: AxiosInstance = axios.create({
  baseURL: DEBTOURL,
});

type Data = Record<string, any>;

// Define a simplified type for responses
interface BackendAPIResponse {
  type: 'success' | 'error';
  message: string;
  data?: Data | Data[] | null | undefined | any;
  error?: string;
  date: string;
}

// Define a unified request function
const request = async (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: Data): Promise<Data> => {
  const response: AxiosResponse<Data> = await api[method](url, data);
  return response;
};

export const apiFunctions = {
  get: (url: string) => request('get', url),
  post: (url: string, data: Data) => request('post', url, data),
  put: (url: string, data: Data) => request('put', url, data),
  del: (url: string, data?: Data) => request('delete', url, data),
};
