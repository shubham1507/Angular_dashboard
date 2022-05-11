import { Injectable } from "@angular/core";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RestApi } from "./restapi.service";
@Injectable()
/**Shared service for providing the shared data */
export class SharedService {
  endpoints: any;

  userData$: BehaviorSubject<any> = new BehaviorSubject<any>({});


  constructor(private _http: HttpClient, private _restApi: RestApi) {
    this.endpoints = environment.endpoints;
  }

  static getBuidingNameHeader(buildingName: string): HttpHeaders {
    let headers = new HttpHeaders({
      "X-BuildingName": typeof buildingName == "undefined" ? "" : buildingName
    });
    return headers;
  }

  /**
   * this method sets the userdata in userData$ BehaviorSubject.
   * @param userData 
   */
  setUser(userData: any) {
    this.userData$.next(userData);
  }

  getStaffDetails() {
    // return this._http.get<any>(this.endpoints.getStaffDetails);
    return this._restApi.makeApiCall("get", this.endpoints.getStaffDetails);
  }

  getIncidents() {
    // return this._http.get<any>(this.endpoints.getIncidents);
    return this._restApi.makeApiCall("get", this.endpoints.getIncidents);
  }

  getIncidentsGlobal() {
    return this._restApi.makeApiCall("get", this.endpoints.getIncidentsGlobal);
  }

  getFilteredIncidents() {
    // return this._http.get<any>(this.endpoints.getFilteredIncidents);
    return this._restApi.makeApiCall(
      "get",
      this.endpoints.getFilteredIncidents
    );
  }

  getLoggedInUserDetails(userEmail: string) {
    //replace user email
    let url = this.endpoints.getUserDetails + "?emailId=" + userEmail;
    let headers = SharedService.getBuidingNameHeader("Kalyani Vista (KV)");
    return this._restApi.makeApiCall("get", url, undefined, {
      headers: headers
    });
  }

  getMappedUserData(userData) {
    let mappedUserData = {};

    let buildingList = userData.data.additionalBuildingsAssigned;
    if (!buildingList) {
      buildingList = [];
    }
    buildingList.splice(0, 0, userData.data.buildingsAssigned);

    buildingList = buildingList.filter(function (buildingVal, index, self) {
      return index === self.indexOf(buildingVal);
    });

    mappedUserData["userData"] = userData.data;
    mappedUserData["buildingData"] = buildingList;

    return mappedUserData;
  }

  getLocaleLanguages() {
    return this._restApi.makeApiCall("get", this.endpoints.getLocaleLanguages);
  }

  getCountriesData() {
    // return this._http.get<any>(this.endpoints.getCountriesData);
    return this._restApi.makeApiCall("get", this.endpoints.getCountriesData);
  }

  getPopularLocations() {
    // return this._http.get<any>(this.endpoints.getPopularLocations);
    return this._restApi.makeApiCall("get", this.endpoints.getPopularLocations);
  }

  getOccurenceData(selectedLocation: string, requestBody: any, page: number, size: number) {
    let url = this.endpoints.getOccurenceData + "?page=" + page + "&size=" + size;
    let headers = SharedService.getBuidingNameHeader(selectedLocation);
    return this._restApi.makeApiCall("post", url, requestBody, { headers: headers });
  }

  getOccurrenceCount(selectedLocation: string, requestBody: any) {
    let headers = SharedService.getBuidingNameHeader(selectedLocation);
    return this._restApi.makeApiCall("post", this.endpoints.getOccurrenceCount, requestBody, { headers: headers });
  }

  getShiftDetails(selectedLocation: string) {
    let url = this.endpoints.getShiftDetails;
    let headers = SharedService.getBuidingNameHeader(selectedLocation);
    return this._restApi.makeApiCall("get", url, {}, { headers: headers });
  }

  getStaffCount(selectedLocation: string) {
    let url = this.endpoints.getStaffCount;
    let headers = SharedService.getBuidingNameHeader(selectedLocation);
    return this._restApi.makeApiCall("get", url, {}, { headers: headers });
  }

  getStaffCompliance(selectedLocation: string, requestBody: any, page: number, size: number) {
    let url = this.endpoints.getstaffCompliance + "?page=" + page + "&size=" + size;
    let headers = SharedService.getBuidingNameHeader(selectedLocation);
    return this._restApi.makeApiCall("post", url, requestBody, { headers: headers });
  }

  /**Shared service to store data in a new variable in localStorage */
  setLocalStorageVariable(key: string, value: any, convertToString?: boolean) {
    value = convertToString ? JSON.stringify(value) : value;
    localStorage.setItem(key, value);
  }

  /**Shared service to remove stored variable from localStorage */
  removeLocalStorageVariable(key: string) {
    localStorage.removeItem(key);
  }

  /**Shared service to remove stored variable from localStorage */
  getLocalStorageVariable(key: string, parseJson?: boolean): any {
    let result = localStorage.getItem(key);
    result = parseJson ? JSON.parse(result) : result;
    return result;
  }

  /**Get userdata from people-search */
  getPeopleSearchData(emailId: string) {
    let url = environment.appPath + this.endpoints.peopleSearchUrl.replace("{userEmail}", emailId);
    return this._restApi.makeApiCall("get", url);
  }

  /** Search security staff for selected location */
  searchSecurityPersonnel(query: string, selectedLocation: string) {
    let url = this.endpoints.searchSecurityPersonnel + "?query=" + query;
    let headers = SharedService.getBuidingNameHeader(selectedLocation);
    return this._restApi.makeApiCall("get", url, {}, { headers: headers });
  }
}
