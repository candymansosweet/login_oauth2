import { computed, inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
// import { NotificationService } from "src/app/services/notification.service";
import { AuthStateService } from "./auth-state.service";
import { RouteDataKeys } from "../constants/constant";
import { PermissionService } from "./permission.service";
import { OAuthService } from "angular-oauth2-oidc";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authState = inject(AuthStateService);
  private router: Router = inject(Router);
  private oauthService = inject(OAuthService);

  readonly currentUser = computed(() => this.authState.auth());
  private permissionService = inject(PermissionService);
  constructor(
    // private notification: NotificationService,
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.loadDiscoveryDocument().then(() => {
        this.oauthService.initLoginFlow();
      });
      return false;
    }
    else {
      return true; // Cho phép vào route
    }
  }
}
