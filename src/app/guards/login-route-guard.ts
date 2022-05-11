import { CanActivate, Router } from "@angular/router";
import { Injectable, Inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { DOCUMENT } from "@angular/common";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";

@Injectable()
/**
 * Login route guard used to validate
 * whether the user is logged in or not
 */
export class LoginRouteGuard implements CanActivate {
  /**
   * Constructor function used to initialise the
   * reports service and the router instances
   * @param reportsService
   * @param router
   */
  constructor(private _authService: AuthService, private router: Router, @Inject(DOCUMENT) private document: any) { }

  /**
   * Can activate interface implementation for the user logged in functionality
   */
  canActivate() {
    //Check for the user logged in or not navigate to the error route if not logged.
    return this._authService.getNewAccessToken().pipe(
      map(response => {
        if (typeof response == "object") {
          AuthService.setLocalStorageVariables(response);
          return true;
        }
        else if (typeof response == 'boolean' && response) {
          return true;
        }
        else {
          return false;
        }
      })
    );
  }
}
