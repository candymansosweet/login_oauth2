import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { inject } from "@angular/core";
import { StorageKeys } from "common-lib/src/lib/constants/constant";
import { OAuthService } from "angular-oauth2-oidc";

export abstract class ServiceAbstract {
    baseUrl = '';
    fileUrl = '';
    public httpClient = inject(HttpClient);
    private router = inject(Router);
    private oauthService = inject(OAuthService);
    constructor(protected configService: any
    ) {
        const config = this.configService.getConfig();
        this.baseUrl = config.api.baseUrl;
    }
    openFile(filePath: string) {
        var url = `${this.baseUrl}`.replace('/api', '') + `/${filePath}`;
        window.open(url, '_blank');
    }
    get(url: string, params?: any, responseType?: string): Observable<any> {
        if(params){
            for(var key in params){
              if(params[key] === undefined || params[key] === null){
                delete params[key];
              }
            }
          }
        switch (responseType) {
            case 'text':
                return this.httpClient.get(
                    this.baseUrl + url,
                    {
                        headers: this.createHeaders().set('skipLoading', 'true') || {},
                        params,
                        responseType: 'text',
                    }
                );
            case 'blob':
                return this.httpClient.get(
                    this.baseUrl + url,
                    {
                        headers: this.createHeaders().set('skipLoading', 'true') || {},
                        params,
                        responseType: 'blob',
                    }
                );
            default:
                return this.httpClient.get(
                    this.baseUrl + url,
                    {
                        headers: this.createHeaders().set('skipLoading', 'true') || {},
                        params,
                    }
                );
        }
    }

    post(
        url: string,
        data?: any,
        params?: {},
        responseType?: string,
        headers?: {},
    ): Observable<any> {
        switch (responseType) {
            case 'text':
                return this.httpClient.post(
                    this.baseUrl + url,
                    data,
                    {
                        headers: this.createHeaders(headers) || {},
                        responseType: 'text',
                        params,
                    }
                );
            case 'blob':
                return this.httpClient.post(
                    this.baseUrl + url,
                    data,
                    {
                        headers: this.createHeaders() || {},
                        responseType: 'blob',
                        params,
                    }
                );
            case 'arraybuffer':
                return this.httpClient.post(
                    this.baseUrl + url,
                    data,
                    {
                        headers: this.createHeaders() || {},
                        responseType: 'blob',
                        params,
                    }
                );
            default:
                return this.httpClient.post(
                    this.baseUrl + url,
                    data,
                    {
                        headers: this.createHeaders(headers) || {},
                        params,
                    }
                );
        }
    }

    put(url: string, data: any, responseType?: string): Observable<any> {
        switch (responseType) {
            case 'text':
                return this.httpClient.put(
                    this.baseUrl + url,
                    data,
                    {
                        headers: this.createHeaders() || {},
                        responseType: 'text',
                    }
                );
            default:
                return this.httpClient.put(
                    this.baseUrl + url,
                    data,
                    {
                        headers: this.createHeaders() || {},
                    }
                );
        }
    }

    patch(url: string, data: any, responseType?: string): Observable<any> {
        switch (responseType) {
            case 'text':
                return this.httpClient.patch(
                    this.baseUrl + url,
                    data,
                    {
                        headers: this.createHeaders() || {},
                        responseType: 'text',
                    }
                );
            default:
                return this.httpClient.patch(
                    this.baseUrl + url,
                    data,
                    {
                        headers: this.createHeaders() || {},
                    }
                );
        }
    }

    delete(url: string, id: any, responseType?: string): Observable<any> {
        switch (responseType) {
            case 'text':
                return this.httpClient.delete(
                    this.baseUrl + url + id,
                    {
                        headers: this.createHeaders() || {},
                        responseType: 'text',
                    }
                );
            default:
                return this.httpClient.delete(
                    this.baseUrl + url + id,
                    {
                        headers: this.createHeaders() || {},
                    }
                );
        }
    }
    public createHeaders(headers?: any): HttpHeaders {
        // Why "authorization": see CustomLogoutSuccessHandler on server
        let requestHeader = new HttpHeaders();
        if (headers) {
            for (const [key, value] of Object.entries(headers)) {
                requestHeader = requestHeader.set(key, value as string);
            }
        }
        requestHeader = requestHeader.set('Authorization', 'Bearer ' + this.getToken());
        const url = this.router.url;
        if (url.includes('/share/')) {
            const shareToken = url.split('/').pop() ?? '';
            requestHeader = requestHeader.set('ShareToken', shareToken);

        }
        return requestHeader;
    }
    private getToken(): string {
      return this.oauthService.getAccessToken() ?? '';
    }
}
