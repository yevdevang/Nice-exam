import { inject, Injectable } from '@angular/core';
import { RequestConfig } from '../models/request-config';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  httpResource,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const DISABLE_GLOBAL_LOADER = new HttpContextToken(() => false);

@Injectable({
  providedIn: 'root',
})
export class DataService {
  http = inject(HttpClient);
  previewModeSub = new BehaviorSubject<boolean>(false);

  request<T = any>(config: RequestConfig): Observable<T> {
    const url = `${environment.apiUrl}${config?.url} `;

    return <Observable<T>>this.http.request(config.method, url, {
      body: config?.body,
      headers: { ...config.headers },
      context: new HttpContext().set(
        DISABLE_GLOBAL_LOADER,
        config.disableGlobalLoader,
      ),
    });
  }


}
