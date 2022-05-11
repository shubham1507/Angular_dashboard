import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RestApi } from "./restapi.service";
import { SharedService } from "./shared.service";

@Injectable()
export class AttendanceService {

  endpoints: any;

  constructor(private _http: HttpClient, private _restApi: RestApi) {
    this.endpoints = environment.endpoints;
  }

  /**
   * returns response from getAttendanceReport API to attendance component
   */
  getAttendanceReportData(requestBody: any, selectedLocation: string, page: number, size: number) {
    let url = this.endpoints.getAttendanceReport + "?page=" + page + "&size=" + size;
    return this._restApi.makeApiCall(
      "post",
      url,
      requestBody,
      { headers: SharedService.getBuidingNameHeader(selectedLocation) }
    );
  }
}
