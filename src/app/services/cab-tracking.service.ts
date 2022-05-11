import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RestApi } from "./restapi.service";

@Injectable()
export class CabTrackingService {

  endpoints: any;

  constructor(private _http: HttpClient, private _restApi: RestApi) {
    this.endpoints = environment.endpoints;
  }

  getCabOverviewData(options, overViewPostData) {
    return this._restApi.makeApiCall(
      "post",
      this.endpoints.getCabLogOverview,
      overViewPostData,
      options
    );
  }

  getCabLog(options, logData) {
    return this._restApi.makeApiCall(
      "post",
      this.endpoints.getCabLog,
      logData,
      options
    );
  }

  // getCabLogDownload(options, downloadData) {
  //   return this._restApi.makeApiCall(
  //     "post",
  //     this.endpoints.getCabLogDownload,
  //     downloadData,
  //     options
  //   );
  // }

  getCabServiceTypes(options) {
    return this._restApi.makeApiCall(
      "get",
      this.endpoints.getCabServiceTypes,
      {},
      options
    );
  }

  /**
   * Function to retrieve the cab report
   * @param buildingHeader
   * @param requestBody
   */
  getCabReport(buildingHeader, requestBody: any) {
    return this._restApi.makeApiCall(
      "post",
      this.endpoints.getCabReport,
      requestBody,
      { headers: buildingHeader, observe: "response", responseType: "blob" }
    );
  }
}
