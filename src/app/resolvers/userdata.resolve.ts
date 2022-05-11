import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { SharedService } from "../services/shared.service";
import { catchError, map } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class UserDataResolve implements Resolve<any> {
  constructor(private sharedService: SharedService, private router: Router) { }

  handleErrorUserData(errorData) {
    this.router.navigate(["/authpass"]);
    return of({});
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let storage_Token = AuthService.getLoginAccessToken();
    let decoded_token: any = {};
    decoded_token = JSON.parse(window.atob(storage_Token.split(".")[1]));

    let userObser$ = this.sharedService
      .getLoggedInUserDetails(decoded_token["email"])
      .pipe(
        map((userData: any) => {
          this.sharedService.setUser(userData);
          if (userData && userData.data.role.toUpperCase() == "MANAGER") {
            userData = this.sharedService.getMappedUserData(userData);
            return userData;
          }
          else {
            this.handleErrorUserData("Sorry, You don't have access to this portal!");
          }
        }),
        catchError(errorData => this.handleErrorUserData(errorData))
      );

    return userObser$;
  }
}
