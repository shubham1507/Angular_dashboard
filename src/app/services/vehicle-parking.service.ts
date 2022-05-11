import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RestApi } from "./restapi.service";
import { SharedService } from "./shared.service";

@Injectable()
export class VehicleParkingService {

  endpoints: any;

  constructor(private _http: HttpClient, private _restApi: RestApi) {
    this.endpoints = environment.endpoints;
  }

  getVehicleTrackData(selectedLocation: string, requestBody: any) {
    let headers = SharedService.getBuidingNameHeader(selectedLocation);
    // return this._http.get<any>(this.endpoints.getVehicleTrackData);
    return this._restApi.makeApiCall(
      "post",
      this.endpoints.getVehicleTrackData,
      requestBody,
      { headers: headers }
    );
  }

  generateVehicleReport(selectedLocation: string, requestBody: any) {
    let headers = new HttpHeaders({
      "X-BuildingName": typeof (selectedLocation) == "undefined" ? '' : selectedLocation,
      Accept: "application/vnd.ms-excel"
    });
    // return this._http.get<any>(this.endpoints.getVehicleTrackData);
    return this._restApi.makeApiCall(
      "post",
      this.endpoints.getVehicleTrackData,
      requestBody,
      { headers: headers, observe: "response", responseType: "blob" }
    );
  }

  getVehicleTypes(selectedLocation: string) {
    let headers = SharedService.getBuidingNameHeader(selectedLocation);
    return this._restApi.makeApiCall(
      "get",
      this.endpoints.getVehicleTypes,
      {},
      { headers: headers }
    );
  }

  getParkingTypes(selectedLocation: string) {
    let headers = SharedService.getBuidingNameHeader(selectedLocation);
    return this._restApi.makeApiCall(
      "get",
      this.endpoints.getParkingTypes,
      {},
      { headers: headers }
    );
  }

  getVehicleParkingOverview(selectedLocation: string, requestBody: any) {
    let headers = SharedService.getBuidingNameHeader(selectedLocation);
    // return this._http.get<any>(this.endpoints.getVehicleParkingOverview);
    return this._restApi.makeApiCall(
      "post",
      this.endpoints.getVehicleParkingOverview,
      {},
      { headers: headers }
    );
  }

}
