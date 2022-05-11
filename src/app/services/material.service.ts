import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RestApi } from "./restapi.service";
import { SharedService } from "./shared.service";

@Injectable()
export class MaterialService {

  endpoints: any;

  constructor(private _http: HttpClient, private _restApi: RestApi) {
    this.endpoints = environment.endpoints;
  }

  getMaterialData(requestBody: any, selectedLocation: string) {
    return this._restApi.makeApiCall(
      "post",
      this.endpoints.getMaterialData,
      requestBody,
      { headers: SharedService.getBuidingNameHeader(selectedLocation) }
    );
  }

  getMaterialLogCount(selectedLocation: string, startTime: number, endTime: number) {
    let url = this.endpoints.getMaterialLogCount
      .replace(
        "{startTime}",
        startTime
      )
      .replace(
        "{endTime}",
        endTime
      )
    return this._restApi.makeApiCall("get", url, undefined, {
      headers: SharedService.getBuidingNameHeader(selectedLocation)
    });
  }

  /**
   * Function to get the material report
   * @param requestBody
   * @param selectedLocation
   */
  getMaterialReport(requestBody: any, selectedLocation: string) {
    let headers = SharedService.getBuidingNameHeader(selectedLocation);
    // return this._http.post(this.endpoints.getMaterialReport, requestBody, { headers: headers, observe: 'response', responseType: 'blob' });
    return this._restApi.makeApiCall(
      "post",
      this.endpoints.getMaterialReport,
      requestBody,
      { headers: headers, observe: "response", responseType: "blob" }
    );
  }
}
