// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpErrorResponse
// } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
// import { AppConfigService } from '@/services/app-config.service';
// import { StorageKeys } from 'common-lib/src/lib/constants/constant';
// import { OAuthModule, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';


// @Injectable()
// export class CustomHttpInterceptor implements HttpInterceptor {
//   private oauthService = inject(OAuthService);
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     console.log("CustomHttpInterceptor");

//     const token = localStorage.getItem(StorageKeys.TOKEN);
//     // clone request nếu có token và đúng API
//     if (token) {
//       console.log("token ", token);
//       request = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//     }
//     return next.handle(request).pipe(
//       catchError((error: HttpErrorResponse) => {
//         console.log("Interceptor ");
//         if (error.status === 401) {
//           console.log("this.oauthService.getRefreshToken() ", this.oauthService.getRefreshToken());

//           // kiểm tra xem có refresh token không
//           if (this.oauthService.getRefreshToken()) {
//             return from(this.oauthService.refreshToken()).pipe(
//               switchMap(() => {
//                 // lấy lại access token sau khi refresh
//                 const newToken = this.oauthService.getAccessToken();
//                 const newReq = request.clone({
//                   setHeaders: {
//                     Authorization: `Bearer ${newToken}`
//                   }
//                 });
//                 return next.handle(newReq);
//               }),
//               catchError(err => {
//                 console.error("Refresh token failed", err);
//                 this.oauthService.initLoginFlow(); // chuyển hướng login lại
//                 return throwError(() => error);
//               })
//             );
//           } else {
//             // không có refresh token thì quay lại login
//             this.oauthService.initLoginFlow();
//           }
//         }

//         return throwError(() => error);
//       })
//     )
//   }
// }





import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpParams,
  HttpClient
} from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AppConfigService } from '@/services/app-config.service';


export const CustomHttpInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  console.log("CustomHttpInterceptor");

  const oauthService = inject(OAuthService);

  // lấy token từ localStorage
  const token = oauthService.getAccessToken();

  if (token) {
    console.log("token ", token);
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log("Interceptor error", error);

      if (error.status === 401) {
        if (oauthService.getRefreshToken()) {
          // có refresh token thì gọi refresh
          return from(refreshAccessToken(oauthService.getRefreshToken())).pipe(
            switchMap(() => {
              const newToken = oauthService.getAccessToken();
              const newReq = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(newReq);
            }),
            catchError(err => {
              console.error("Refresh token failed", err);
              oauthService.initLoginFlow(); // chuyển hướng login
              return throwError(() => error);
            })
          );
        } else {
          // không có refresh token thì login lại
          oauthService.initLoginFlow();
        }
      }

      return throwError(() => error);
    })
  );
};

function refreshAccessToken(refreshToken: string): Promise<void> {
  return new Promise((relve, reject) => {
    const http = inject(HttpClient);
    const oauthService = inject(OAuthService);
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken)
      .set('client_id', oauthService.clientId as string)
      .set('client_secret', oauthService.dummyClientSecret as string);

    http.post<any>(oauthService.tokenEndpoint as string, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).subscribe({
      next: (res) => {
        console.log("Access token mới:", res.access_token);
        console.log("Refresh token mới:", res.refresh_token);
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        relve();
      },
      error: (err) => {
        console.error("Refresh token error:", err)
        reject();
      }
    });
  })

}
