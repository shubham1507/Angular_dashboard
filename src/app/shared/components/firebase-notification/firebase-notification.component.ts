import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  Input
} from "@angular/core";
import { MessageService } from "primeng/api";

import { AngularFireMessaging } from "@angular/fire/messaging";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { RestApi } from "src/app/services/restapi.service";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { map, takeUntil } from "rxjs/operators";
import { SharedService } from "../../../services/shared.service";
import { WEB_TOKEN } from "../../const";

/**
 * Firebase component used to generate the firebase notifications
 */
@Component({
  selector: "physicalsecurity-firebasenotification",
  templateUrl: "./firebase-notification.component.html",
  styleUrls: ["./firebase-notification.component.scss"],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class FireBaseNotificationComponent implements OnInit, OnDestroy {
  @Input() loadedUserData: Object;
  /**
   * Place holder used to store the notifications data
   */
  notifData: Array<any> = [];

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  /**Place holder to store the user data details  */
  userData: Object;

  /**
   * Constructor used to initialise the firebase notification components
   * @param afMessaging
   * @param _http
   * @param messageService
   */
  constructor(
    private afMessaging: AngularFireMessaging,
    private _restApi: RestApi,
    private sharedService: SharedService,
    private messageService: MessageService
  ) {}

  /**
   * Function to request the permission from the user to show the
   * push notifications and subscribe the user details to the firebase
   * cloud messaging
   */
  requestPermission() {
    let self = this;
    this.afMessaging.requestToken
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(token => {
        let pushNotifHeaders = new HttpHeaders({
          "X-BuildingName":
            typeof self.userData["buildingsAssigned"] == "undefined"
              ? ""
              : self.userData["buildingsAssigned"]
        });
        let options = { headers: pushNotifHeaders };

        let sendDeviceInfoUrl =
          environment.endpoints.sendUserDeviceInfoForFirebase;

        let userDevice = {
          app_version: "",
          building: "",
          city: "",
          country: "",
          dateCreated: "",
          os: "",
          region: "",
          version: ""
        };

        userDevice["app_name"] = self.userData["role"];
        userDevice["deviceToken"] = token;
        userDevice["model_no"] = WEB_TOKEN;
        userDevice["userId"] = self.userData["emailId"];

        this._restApi
          .makeApiCall("post", sendDeviceInfoUrl, userDevice, options)
          .pipe(
            map(successData => this.handleSendNotificationSuccess(successData)), //this will return the response when success
            takeUntil(this.destroyAllSubscriptions)
          )
          .subscribe(val => {});
      });
  }

  handleSendNotificationSuccess(successData) {
    this.recieveMessages();
  }

  /**
   * Function to recieve the pusn notifications from the firebase
   * messaging component
   */
  recieveMessages() {
    this.afMessaging.messages
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(message => {
        this.notifData = [];
        let toastObject = {
          severity: "info",
          summary: message["notification"]["title"],
          detail: message["notification"]["body"]
        };
        this.notifData.push(toastObject);
        this.messageService.addAll(this.notifData);
      });
  }

  /**
   * On initialisation function to initiate the activity for the push notifications
   */
  ngOnInit() {
    this.userData = this.loadedUserData;

    if (this.userData) this.requestPermission();
  }

  /**
   * Destroy life cycle for the fire base notification component
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
