import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RestApi } from "./restapi.service";
import { SharedService } from "./shared.service";

@Injectable()
export class OccurrenceService {

  endpoints: any;

  constructor(private _http: HttpClient, private _restApi: RestApi) {
    this.endpoints = environment.endpoints;
  }

  getOccurenceData(selectedLocation: string, requestBody: any, page: number, size: number) {
    let url = this.endpoints.getOccurenceData + "?page=" + page + "&size=" + size;
    let headers = SharedService.getBuidingNameHeader(selectedLocation);
    return this._restApi.makeApiCall("post", url, requestBody, { headers: headers });
  }

  getOccurrenceReport(selectedLocation: string, requestBody: any) {
    let headers = SharedService.getBuidingNameHeader(selectedLocation);
    return this._restApi.makeApiCall(
      "post",
      this.endpoints.getOccurrenceReport,
      requestBody,
      { headers: headers, observe: "response", responseType: "blob" }
    );
  }

}
