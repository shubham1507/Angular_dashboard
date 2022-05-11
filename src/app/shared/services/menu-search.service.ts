import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RestApi } from "src/app/services/restapi.service";
import { SharedService } from "src/app/services/shared.service";

@Injectable({
  providedIn: 'root'
})
export class MenuSearchService {

  endpoints: any;
  private sharedDTO: any;


  constructor(private _http: HttpClient, private _restApi: RestApi) {
    this.endpoints = environment.endpoints;
  }

  setSharedDTO(val) {
    this.sharedDTO = val;
  }

  getSharedDTO() {
    return this.sharedDTO;
  }

  baseUrl: string = "https://jsonplaceholder.typicode.com/users/";

  search(queryString: string) {
    let _URL = this.baseUrl + queryString;
    return this._http.get(_URL);
  }
}
