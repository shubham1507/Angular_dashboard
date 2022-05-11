import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { AuthService } from "src/app/services/auth.service";
import { environment } from "src/environments/environment";
import { Subject } from "rxjs";
import { takeUntil, map } from "rxjs/operators";
import { SharedService } from "src/app/services/shared.service";

@Component({
  selector: "physicalsecurity-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  showErrorMessage: boolean = false;

  /**
   * Constructor function used to initialse the login Component
   * @param _router
   * @param _route
   * @param _authService
   * @param _sharedService
   * @param document
   */
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _sharedService: SharedService,
    @Inject(DOCUMENT) private document: any
  ) { }

  /**
   * Initialise life cycle hook used to check if code is present query params and
   * get the access token, if not redirect to vIDM login screen
   */
  ngOnInit() {
    this._sharedService.userData$
      .pipe(
        map((userData: any) => {
          if (userData.data && (userData.data.role.toUpperCase() != "MANAGER")) {
            this.showErrorMessage = true;
          }
        }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => { });

    let code = this._route.snapshot.queryParams["code"];
    if (code && typeof code == "string") {
      this._authService
        .getAccessToken(code)
        .pipe(
          map((ssoResponse: any) => {
            AuthService.setLocalStorageVariables(ssoResponse);
            this._router.navigate(["/app/dashboard"]);
          }),
          takeUntil(this.destroyAllSubscriptions)
        )
        .subscribe(res => { });
    } else {
      setTimeout(() => {
        if (
          AuthService.getLoginAccessToken() &&
          AuthService.isAccessTokenValid()
        ) {
          this._router.navigate(["/app/dashboard"]);
        } else {
          AuthService.clearLocalStorage();
          this.document.location.href = environment.endpoints.ssoLogin;
        }
      }, environment.loginScreenWait);
    }
  }

  /**
   * Destroy life cycle hook used to unsubscribe all data subscriptions
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
