import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-oauth2-callback',
  imports: [ProgressSpinnerModule],
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <p class="mb-5">Đang xử lý đăng nhập, vui lòng chờ...</p>
      <p-progress-spinner ariaLabel="loading" />
    </div>`
})
export class Oauth2CallbackComponent {

  private oauthService = inject(OAuthService);
  private router = inject(Router);

  ngOnInit(): void {
    setTimeout(() => {
      if (!this.oauthService.hasValidAccessToken()) {
        console.log("this.oAuthService.tryLoginCodeFlow (get access token)  Oauth2CallbackComponent false");
        this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
          this.router.navigate(['/']); // tránh reload toàn bộ app
          return;
          // console.log('Refresh token:', this.oauthService.getRefreshToken());
        });
      }
      if (this.oauthService.hasValidAccessToken()) {
        console.log("this.oAuthService.tryLoginCodeFlow (get access token)  Oauth2CallbackComponent ");
        this.router.navigate(['/']); // tránh reload toàn bộ app
      }
    }, 2000);
  }
}
