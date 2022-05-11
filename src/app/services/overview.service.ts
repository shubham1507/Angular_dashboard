import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RestApi } from "./restapi.service";
import { SharedService } from "./shared.service";

@Injectable()
export class OverviewService {

  endpoints: any;

  constructor(private _http: HttpClient, private _restApi: RestApi) {
    this.endpoints = environment.endpoints;
  }

  getDeploymentData() {
    // return this._http.get<any>(this.endpoints.getDeploymentData);
    return this._restApi.makeApiCall("get", this.endpoints.getDeploymentData);
  }
}
