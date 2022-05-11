import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { environment } from "src/environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, Subscription, combineLatest, of } from "rxjs";

import {
  Language,
  DefaultLocale,
  LocaleService,
  TranslationService
} from "angular-l10n";
import { SharedService } from "src/app/services/shared.service";
import { RestApi } from "src/app/services/restapi.service";
import { map, take, takeUntil, catchError } from "rxjs/operators";
import * as moment from "moment";
import { Location } from "@angular/common";

@Component({
  selector: "physicalSecurity-location-details",
  templateUrl: "./location-details.component.html",
  styleUrls: ["./location-details.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class LocationDetailsComponent implements OnInit, OnDestroy {
  /**
   * Language decorator used to translate the language texts
   */
  @Language() lang: string;

  /**
   * Default locale provides the context for the selected locale
   */
  @DefaultLocale() defaultLocale: string;

  /**
   * Conditional flag for the overview active status
   */
  overviewActive: boolean = false;

  /**
   * Conditional flag for the staff active status
   */
  staffActive: boolean = false;

  /**
   * Conditional flag for reports active status
   */
  reportsActive: boolean = false;

  /**
   * Conditional flag for the open location dropdown
   */
  openLocDropdown: boolean = false;

  /**
   * Place holder used to store the office locations
   */
  officeLocations: any;

  /**
   * Place holder used to store the invalid dates
   */
  invalidDates: Array<Date> = [];

  /**
   * Place holder for storing the selected office location
   */
  selectedOfficeLocation: string;

  /**
   * Subject for opening the briefing modal
   */
  openBriefingModalSubject: Subject<any> = new Subject();

  /**
   * Subject for opening the broadcast modal
   */
  openBroadcastModalSubject: Subject<any> = new Subject();

  /**
   * Subject for sending the notification data
   */
  notificationDataSubject: Subject<any> = new Subject();

  /**
   * Subject for show/hide functionality of notifications
   */
  notificationShowSubject: Subject<any> = new Subject();

  /**
   * Conditional flag to show/hide the notifications badge
   */
  hideBadge: boolean = false;

  /**
   * Place holder used to hold the notification count
   */
  notificationCount: Number;

  /**
   * Place holder used to store the search text language key
   */
  searchtext: string;

  /**
   * Place holder used to store the user data
   */
  userData: Object;

  /**
   * Subject to automatically unsubscribe all subscriptions
   */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

   /**
   * string to set default selected tab
   */
  selectedTab: string;

  isAccessGranted: boolean = false;
  notifBackdrop: boolean = false;

  /**
   * Constructor function used to initialse the location details component
   * @param reportsService
   * @param route
   * @param formBuilder
   */
  constructor(
    public locale: LocaleService,
    public translation: TranslationService,
    private sharedService: SharedService,
    private _restApi: RestApi,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  /**
   * opens the briefing modal
   */
  openBriefingModal() {
    this.openBriefingModalSubject.next();
  }

  /**
   * opens the broadcast modal
   */
  openBroadcastModal() {
    this.openBroadcastModalSubject.next();
  }

  /**
   * shows the location dropdown
   * @param evt
   */
  showLocationMenu(evt) {
    evt.stopPropagation();
    this.openLocDropdown = true;
  }

  /**
   * Get notifications for the selected office location
   */
  getNotificationsForLocation() {
    let getNotifUrl = environment.endpoints.getNotificationForOfcLocation;

    //Assigning the headers data
    let optionsData = {
      "X-BuildingName":
        typeof this.selectedOfficeLocation.trim() == "undefined"
          ? ""
          : this.selectedOfficeLocation.trim()
    };
    let options = { headers: optionsData };

    let queryData = {};
    queryData["appName"] = this.userData["role"];
    queryData["building"] = this.selectedOfficeLocation.trim();
    let currentTime = new Date().getTime();
    queryData["startDateTime"] = moment(currentTime).subtract(1, 'day').toDate().getTime();
    queryData["endDateTime"] = currentTime;

    this._restApi
      .makeApiCall("post", getNotifUrl, queryData, options)
      .pipe(
        map(successData => this.passNotificationData(successData)),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(val => { });
  }

  /**
   * Pass notification data to the notifications component
   * @param notifData
   */
  passNotificationData(notifData) {
    let notifState = {};
    notifState["notifData"] = notifData;
    this.notificationDataSubject.next(notifState);
  }

  /**
   * selects office location
   * @param evt
   */
  selectOfcLocation(evt, ofcLoc: string) {
    evt.stopPropagation();
    this.selectedOfficeLocation = ofcLoc.trim();
    this.getNotificationsForLocation();
    let navigateToLocation =
      "app/location/" + this.selectedOfficeLocation.trim();
    this.router.navigate([navigateToLocation]);
    this.openLocDropdown = false;
  }

  /**
   * hides the location dropdown
   */
  hideLocationMenu() {
    this.openLocDropdown = false;
  }

  /**
   * gets the notification count
   * @param notifCount notification count
   */
  getNotificationsCount(notifCount) {
    this.notificationCount = notifCount;
    this.hideBadge =  this.notificationCount > 0 ? true : false;
  }

  /**
   * shows notifications
   * @param evt
   */
  showNotifications(evt) {
    evt.stopPropagation();
    this.hideBadge = false;
    let notifState = {};
    notifState["open"] = true;
    this.notifBackdrop = true;
    this.notificationShowSubject.next(notifState);
  }

  /**
   * hides notifications
   */
  hideNotifications() {
    let notifState = {};
    notifState["open"] = false;
    this.notifBackdrop = false;
    this.notificationShowSubject.next(notifState);
  }

  /**
   * changes the url to contain selected tab without triggering state change
   */
  setSelectedTab (tab) {
    this.location.go(`/app/location/${escape(this.selectedOfficeLocation)}/${tab}`);
  }

  /**
   * Initialise function for fetching the initial location data
   */
  initLocData() {
    this.route.paramMap
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(paramsMap => {
        this.selectedOfficeLocation = paramsMap.get("selectedParam").trim();
        this.selectedTab = paramsMap.get("selectedTab") || '';
        let mappedUserData = this.route.snapshot.data["resolvedUserData"];

        this.officeLocations = mappedUserData["buildingData"];
        this.userData = mappedUserData["userData"];

        if ( this.selectedTab === 'staff' ) {
          this.staffActive = true;
        } else if ( this.selectedTab === 'reports' ) {
          this.reportsActive = true;
        } else {
          this.overviewActive = true;
        }


        if (!this.officeLocations.includes(this.selectedOfficeLocation)) {
          this.isAccessGranted = false;
          this.router.navigate(['/app/dashboard']);
        } else {
          this.isAccessGranted = true;
          this.getNotificationsForLocation();
        }
      });
  }

  /**
   * Init functions used to get the location name as route parameter
   */
  ngOnInit() {
    this.translation
      .translationChanged()
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(() => {
        this.searchtext = this.translation.translate("searchtext");
      });

    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(error => {
        if (error) {
          console.error(error);
        }
      });

    this.initLocData();
  }

  /**
   * destroy function used to unsubscribe all the subscription in this component
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
