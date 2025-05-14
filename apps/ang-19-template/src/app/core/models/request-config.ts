export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: never | Record<string, any>;
  disableGlobalLoader?: boolean;
  responseType?: 'json' | 'text';
  observe?: string;
}
