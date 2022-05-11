import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

/**
 * This is Rest Ajax api for all ajax calls. We have defined all the useful methods here.
 * Wrappers on top of Angular's HttpClient
 */

@Injectable()
export class RestApi {
  baseURL: any;
  endpoint: any;

  /**
   * Innitialize RestApi
   * @param _http
   * @param _config
   */
  constructor(private _http: HttpClient) {
    /** get the environment specific api urls based on environment */
    this.endpoint = environment.endpoints;
  }

  /**
   * Constructs the full url based on configuration.
   * @param url
   * @returns {any}
   */
  private constructUrl(url: string) {
    // return `${this.endpoint}${url}`;
    return url;
  }

  /**
   * method through which all API calls are made
   * @param method
   * @param url
   * @param body
   * @param headers
   */
  makeApiCall(method: string, url: string, body?: Object, options?: Object) {
    switch (method) {
      case "get":
        return this.get(url, options);
        break;
      case "post":
        return this.post(url, body, options);
        break;
      case "put":
        return this.put(url, body, options);
        break;
      case "delete":
        return this.delete(url, options);
        break;
    }
  }
  /**
   *  Perform HTTP GET request
   *  @param url url of the resource to be fetched
   *  @param headers optional custom headers
   *  @returns {Observable}
   */
  public get(url: string, options?: Object): Observable<any> {
    return this._http.get(this.constructUrl(url), options);
  }

  /**
   *  Perform HTTP POST request
   *  @param url url of the resource
   *  @param body request body
   *  @param headers optional custom headers
   *  @returns {Observable}
   */
  public post(url: string, body: Object, options?: Object): Observable<any> {
    return this._http.post(
      this.constructUrl(url),
      JSON.stringify(body),
      options
    );
  }

  /**
   *  Perform HTTP PUT request
   *  @param url url of the resource
   *  @param body request body
   *  @param headers optional custom headers
   *  @returns {Observable}
   */
  public put(url: string, body: Object, options?: Object): Observable<any> {
    return this._http.put(
      this.constructUrl(url),
      JSON.stringify(body),
      options
    );
  }

  /**
   *  Perform HTTP DELETE request
   *  @param url url of the resource to be deleted
   *  @param headers optional custom headers
   *  @returns {Observable}
   */
  public delete(url: string, options?: Object): Observable<any> {
    return this._http.delete(this.constructUrl(url), options);
  }

  /**
   *  Perform HTTP PATCH request
   *  @param url url of the resource
   *  @param body request body
   *  @param headers optional custom headers
   */
  public patch(
    url: string,
    body: Object,
    headers?: HttpHeaders
  ): Observable<any> {
    return this._http.patch(this.constructUrl(url), JSON.stringify(body), {
      headers: headers
    });
  }
}
