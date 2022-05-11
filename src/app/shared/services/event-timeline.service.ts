import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RestApi } from "src/app/services/restapi.service";
import { SharedService } from "src/app/services/shared.service";

@Injectable()
export class EventTimelineService {

  endpoints: any;

  constructor(private _http: HttpClient, private _restApi: RestApi) {
    this.endpoints = environment.endpoints;
  }

  getTimeLineData() {
    // return this._http.get<any>(this.endpoints.getTimelineData);
    return this._restApi.makeApiCall("get", this.endpoints.getTimelineData);
  }
}
