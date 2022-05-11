import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { RestApi } from "./restapi.service";
import { of } from "rxjs";

@Injectable()
export class AuthService {
  /**
   * Constructor function used to initialse the AuthService
   * @param _http
   * @param _restApi
   */
  constructor(private _http: HttpClient, private _restApi: RestApi) { }

  /**
   * gets the access token
   * @param authCode
   */
  getAccessToken(authCode: string) {
    let url =
      environment.appPath +
      environment.endpoints.getAccessToken
        .replace("{redirectUrl}", environment.redirectUrl)
        .replace("{authCode}", authCode);
    // return this._http.post(url, {}, { headers: this.getAuthHeaders() });
    return this._restApi.makeApiCall(
      "post",
      url,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * checks the validity of access token and if invalid requests for new access token
   */
  getNewAccessToken() {
    if (!AuthService.isAccessTokenValid()) {
      let refreshToken = localStorage.getItem("refresh_token");
      let url =
        environment.appPath +
        environment.endpoints.getNewAccessToken
          .replace("{redirectUrl}", environment.redirectUrl)
          .replace("{refreshToken}", refreshToken);
      // return this._http.post(url, {}, { headers: this.getAuthHeaders() });
      return this._restApi.makeApiCall(
        "post",
        url,
        {},
        { headers: this.getAuthHeaders() }
      );
    } else {
      return of(true);
    }
  }

  /**
   * gets the headers required for auth APIs
   */
  getAuthHeaders(): HttpHeaders {
    let authHeaders = new HttpHeaders({
      Authorization: "Basic " + environment.clientSecret
    });
    return authHeaders;
  }

  /**
   * stores the access token other response in localstorage
   * @param ssoResponse
   */
  static setLocalStorageVariables(ssoResponse: any) {
    let expiryTime =
      new Date().getTime() + parseInt(ssoResponse.expires_in) * 1000 - 30000;
    localStorage.setItem("access_token", ssoResponse.access_token);
    localStorage.setItem("expires_at", expiryTime.toString());
    localStorage.setItem("refresh_token", ssoResponse.refresh_token);
  }

  static clearLocalStorage() {
    localStorage.clear();
  }

  /**
   * gets the current Timezone
   */
  static getTimeZone(): string {
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timeZone;
  }

  /**
   * Check the validity for the access token
   */
  static isAccessTokenValid(): boolean {
    let currentTime = new Date().getTime();
    let expiryTime = Number(localStorage.getItem("expires_at"));
    if (currentTime > expiryTime) {
      return false;
    } else return true;
  }

  /**
   * Get the login access token
   */
  static getLoginAccessToken(): string {
    return localStorage.getItem("access_token");
  }

  /**
   * Check for the validity for the request url
   * @param req
   */
  isRequestUrlValid(req) {
    return (
      req.url.indexOf("/oauth/token") === -1 &&
      req.url.indexOf("sso-response.json") === -1 &&
      req.url.indexOf("assets/i18n") === -1
    );
  }
}
