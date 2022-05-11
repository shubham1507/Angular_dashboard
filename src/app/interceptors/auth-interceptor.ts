import { Injectable, Inject } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { DOCUMENT } from "@angular/common";
import { AuthService } from "../services/auth.service";
import { environment } from "../../environments/environment";
import { switchMap, catchError, retry } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
/***
 * Http Auth interceptor for http requests
 * used to validate the expiry token and
 * if token is expired generate a new token
 * also used to validate the connection status of the network
 */
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Constructor function used to initialise the http Auth Interceptor
   * @param _authService
   * @param _router
   */
  constructor(
    private _authService: AuthService,
    private _router: Router,
    @Inject(DOCUMENT) private document: any
  ) { }

  /**
   * Interceptor function activated for every http request
   * @param req
   * @param next
   * @returns Observable<HttpEvent><any>
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this._authService.isRequestUrlValid(req)) {
      return this._authService.getNewAccessToken().pipe(
        switchMap(response => {
          if (!navigator.onLine) {
            // If no internet connection we can show the 404 Template
            this._router.navigateByUrl("/error");
          }
          if (typeof response == "object") {
            AuthService.setLocalStorageVariables(response);
          }
          let headers;
          if (req.url.indexOf('people-search') != -1) {
            headers = {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            };
          }
          else {
            headers = {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
              "X-AppID": environment.appId,
              "X-TenantID": environment.tenantId,
              "X-TimeZone": AuthService.getTimeZone(),
              "Content-Type": "application/json"
            };
          }

          const authReq = req.clone({ setHeaders: headers });
          return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
              let errMsg = "";
              // Client Side Error
              if (error.error instanceof ErrorEvent) {
                errMsg = `Error: ${error.error.message}`;
              } else {
                // Server Side Error
                errMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                if (error.status == 401 || error.status == 403) {
                  // AuthService.clearLocalStorage();
                  this.document.location.href = environment.endpoints.ssoLogin;
                }
              }
              return throwError(errMsg);
            })
          );
        })
      );
    } else {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          let errMsg = "";
          // Client Side Error
          if (error.error instanceof ErrorEvent) {
            errMsg = `Error: ${error.error.message}`;
          } else {
            // Server Side Error
            errMsg = `Error Code: ${error.status},  Message: ${error.message}`;
            if (error.status == 401 || error.status == 400) {
              AuthService.clearLocalStorage();
              this.document.location.href = environment.endpoints.ssoLogin;
            }
          }
          return throwError(errMsg);
        })
      );
    }
  }
}
