import { AuthService } from '@/services/auth.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-signout-callback-oidc',
  imports: [ProgressSpinnerModule],
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <p class="mb-5">Đang xử lý đăng xuất, vui lòng chờ...</p>
      <p-progress-spinner ariaLabel="loading" />
    </div>`
})
export class SignoutCallbackOidcComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    console.log("this.oAuthService.logOut FE (localStorage, session)");

    this.authService.logout().subscribe({
      next: (res) => {
        console.log("delete cookie success");

        // Chuyển hướng về trang home
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);
      },
    })
  }
}
