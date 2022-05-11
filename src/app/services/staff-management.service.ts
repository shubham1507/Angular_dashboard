import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RestApi } from "./restapi.service";
import { SharedService } from "./shared.service";

@Injectable()
export class StaffManagementService {

  endpoints: any;

  constructor(private _http: HttpClient, private _restApi: RestApi) {
    this.endpoints = environment.endpoints;
  }
}
