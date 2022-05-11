import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import { Subject, of, forkJoin, combineLatest } from "rxjs";
import { DashboardService } from "src/app/services/dashboard.service";
import { SharedService } from "../../services/shared.service";
import { environment } from "src/environments/environment";
import { CHART_CONFIG, REGIONS } from "src/app/shared/const";
import { Router, ActivatedRoute } from "@angular/router";
import * as moment from "moment";

import {
  Language,
  DefaultLocale,
  LocaleService,
  TranslationService,
  DateTimeOptions
} from "angular-l10n";
import { RestApi } from "src/app/services/restapi.service";
import { map, takeUntil, catchError, take } from "rxjs/operators";

/**
 * dashboard component for the dashboard view
 * includes the consolidated view for the eventtime line
 * news feed incident data
 */
@Component({
  selector: "physicalSecurity-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
  /**
   * Language decorator used to translate the language texts
   */
  @Language() lang: string;

  /**
   * Default locale context for the selected locale
   */
  @DefaultLocale() defaultLocale: string;

  /**
   * Place holder for the welcome text of the language key
   */
  welcomeText: string;

  /**
   * Place holder for the open incident text of the language key
   */
  openIncidentsText: string;

  /**
   * Place holder for the resource shortage text of the language key
   */
  resourceShortageText: string;

  /**
   * Place holder for the staff compliance  tasks text of the language key
   */
  staffCompTasksText: string;

  /**
   * Place holder for the news feed text of the language key
   */
  newsFeedText: string;

  /**
   * place holder for storing incidents data
   */


  /**
   * place holder for storing the incident Type list
   */
  incidentTypeList: any[] = [];

  /**
   * Place holder for storing the region list
   */
  regionList = [];

  /**
   * conditional flag for opening the incident details modal
   */
  incidentDetailsModal: boolean = false;

  /**
   * place holder for storing the staff Compliance data
   */


  /**
   * Array Place holder for storing the compliance data regions
   */
  complianceDataRegions: Object[];

  /**
   * place holder for storing the resource shortage data
   */
  resourceShortageData: any;

  /**
   * place holder for storing the regions
   */
  regions = REGIONS;

  /**
   * place holder for storing the user data
   */
  userData: any;

  buildingList: string[];

  /**
   * Conditional subject instance for opening the briefing modal
   */
  openBriefingModalSubject: Subject<any> = new Subject();

  /**
   * Conditional subject instance for opening the notifications
   */
  notificationSubject: Subject<any> = new Subject();

  /**
   * Conditional subject instance for opening the broadcast modal
   */
  openBroadcastModalSubject: Subject<any> = new Subject();

  /**
   * place holder for storing the notifications count
   */
  notificationCount: Number;

  /**
   * conditional flag for showing and hiding the notification badge count
   */
  hideBadge: boolean = false;

  /**Place holder for the add clear btn for charts  */
  addClearBtn: boolean = CHART_CONFIG.incConstants.CHARTPROPERTIES.ADDCLEARBTN;

  /**Place holder for right align btn for charts  */
  rightAlign: boolean = CHART_CONFIG.incConstants.CHARTPROPERTIES.RIGHTALIGN;

  /**Place holder for chart options for charts  */
  chartOptions: any;

  /**Place holder for the clear text for charts  */
  clearText = CHART_CONFIG.incConstants.CLEAR;

  /**Place holder for the legend colors for charts  */
  legendColors = CHART_CONFIG.incConstants.LEGENDCOLORS;

  /**Place holder for chart id for charts  */
  chartid = CHART_CONFIG.incConstants.CHARTPROPERTIES.CHARTID;

  /** Subject for the notification data  */
  notificationDataSubject: Subject<any> = new Subject();

  /**Subject for the notification (show/hide functionality)  */
  notificationShowSubject: Subject<any> = new Subject();

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  isAccessGranted: boolean = false;
  incidentsData2: any;
  dateOptions: DateTimeOptions = { month: "short", day: "numeric" };
  selectedIncidentDetails: any;
  incidentDateRange: Date[] = [
    new Date(moment().startOf('month').format()),
    new Date(moment().endOf('month').format())
  ];

  incidentTableLoading: boolean = false;
  selectedIncidentPageNo: number = 1;
  selectedComplianceType: string = "All";
  selectedCompliancePageNo: number = 1;
  complianceTableLoading: boolean = false;
  complianceData: any;
  notifBackdrop: boolean = false;


  /***
   * Constructor function used to initialise the dashboard component
   */
  constructor(
    public locale: LocaleService,
    public translation: TranslationService,
    private dashboardService: DashboardService,
    private sharedService: SharedService,
    private _restApi: RestApi,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /**
   * open the briefing modal component from dashboard
   */
  openBriefingModal() {
    this.openBriefingModalSubject.next();
  }

  /**
   * open the  broadcasr modal component from dashboard
   */
  openBroadcastModal() {
    this.openBroadcastModalSubject.next();
  }

  /**
   * get the total notifications count for the notifications
   */
  getNotificationsCount(notifCount) {
    this.notificationCount = notifCount;
    this.hideBadge =  this.notificationCount > 0 ? true : false;
  }

  /**
   * Show the notification messages for the logged in user
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
   * Hide the notifications when user clicks out side the notifications container
   */
  hideNotifications() {
    let notifState = {};
    notifState["open"] = false;
    this.notificationShowSubject.next(notifState);
    this.notifBackdrop = false;
  }

  /**Function to get the notifications for the selected location */
  getNotificationsForLocation() {
    let getNotifUrl = environment.endpoints.getNotificationForOfcLocation;

    //Assigning the headers data
    let optionsData = {
      "X-BuildingName":
        typeof this.userData["buildingsAssigned"] == "undefined"
          ? ""
          : this.userData["buildingsAssigned"]
    };
    let options = { headers: optionsData };

    let queryData = {};
    queryData["appName"] = this.userData["role"];
    queryData["building"] = this.userData["buildingsAssigned"];
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

  /** Pass retrieved notifications for the notifications components */
  passNotificationData(notifData) {
    let notifState = {};
    notifState["notifData"] = notifData;
    this.notificationDataSubject.next(notifState);
  }

  /**
   *clear the incident and reset the chart type data
   * for the incidents
   */
  clearFunction() {
    this.sharedService
      .getIncidents()
      .pipe(
        map((incidentsData: any) => {

        }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => { });
  }

  /**
   * Populated the chart data for the selected incident type
   * @param selectedIncidentType
   */
  legendClick(selectedIncidentType: string) {
    this.sharedService
      .getFilteredIncidents()
      .pipe(
        map((incidentsData: any) => {

        }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => { });
  }

  /**
   * open the incident modal
   * @param incident
   */
  openIncidentModal(incident: any) {
    console.log(incident, "incident")
    this.selectedIncidentDetails = incident;
    this.incidentDetailsModal = true;
  }

  selectTimeRange(range: string) {
    if (range == 'Today') {
      this.incidentDateRange[0] = new Date(moment().startOf('day').format());
      this.incidentDateRange[1] = new Date(moment().endOf('day').format());
    }
    else if (range == 'This Week') {
      this.incidentDateRange[0] = new Date(moment().startOf('week').format());
      this.incidentDateRange[1] = new Date(moment().endOf('week').format());
    }
    else if (range == 'This Month') {
      this.incidentDateRange[0] = new Date(moment().startOf('month').format());
      this.incidentDateRange[1] = new Date(moment().endOf('month').format());
    }
    else if (range == 'Last Month') {
      this.incidentDateRange[0] = new Date(moment().startOf('month').subtract(1, 'month').format());
      this.incidentDateRange[1] = new Date(moment().endOf('month').subtract(1, 'month').format());
    }
    this.selectedIncidentPageNo = 1;
    this.getIncidentsCount();
    this.getIncidentsData();
  }

  getIncidentsCount() {
    let requestBody = {};
    requestBody['startDateTime'] = this.incidentDateRange[0].getTime();
    requestBody['endDateTime'] = this.incidentDateRange[1].getTime();
    requestBody['isBAUNormalEvent'] = false;
    requestBody['buildingNames'] = this.buildingList;
    this.sharedService.getOccurrenceCount(this.buildingList[0], requestBody)
      .pipe(map((incidentCountData) => {
        if (incidentCountData && incidentCountData.data.incidentTypeCount) {
          this.incidentTypeList = [];
          incidentCountData.data.incidentTypeCount.forEach((element) => {
            let incidentTypeObject = {
              "key": element.incidentType,
              "y": element.count
            };
            this.incidentTypeList.push(incidentTypeObject);
          });
        }
        else {
          this.incidentTypeList = [{ "key": "Open Incidents", "y": 0 }];
        }
        console.log(this.incidentTypeList, "this.incidentTypeList");
      }),
        catchError(errorData => {
          this.incidentTypeList = [];
          return of({});
        }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => {
      });
  }

  refreshIncidentTable(evt: any) {
    this.getIncidentsData();
  }

  getIncidentsData() {
    setTimeout(() => { this.incidentTableLoading = true; }, 0);
    let requestBody = {
      "isBAUNormalEvent": false
    };
    requestBody['startDateTime'] = this.incidentDateRange[0].getTime();
    requestBody['endDateTime'] = this.incidentDateRange[1].getTime();
    requestBody['buildingNameList'] = this.buildingList;

    this.sharedService.getOccurenceData(this.buildingList[0], requestBody, this.selectedIncidentPageNo, 7)
      .pipe(map((incidentsData: any) => {
        setTimeout(() => {
          console.log(incidentsData)
          if (incidentsData) {
            this.incidentsData2 = incidentsData;
          } else {
            this.incidentsData2 = {
              pageDetails: {
                "page": 0,
                "size": 7,
                "totalPages": 0,
                "totalCount": 0
              },
              data: []
            };
          }
          this.incidentTableLoading = false;
        }, 0);
      }),
        catchError(errorData => {
          this.incidentsData2 = {
            pageDetails: {
              "page": 0,
              "size": 7,
              "totalPages": 0,
              "totalCount": 0
            },
            data: []
          };
          this.incidentTableLoading = false;
          return of({});
        }),
        takeUntil(this.destroyAllSubscriptions))
      .subscribe(res => {
      });
  }

  selectComplianceType(taskType: string) {
    this.selectedComplianceType = taskType;
    this.selectedCompliancePageNo = 1;
    this.getComplianceData();
  }

  refreshComplianceTable(evt: any) {
    this.getComplianceData();
  }

  getComplianceData() {
    setTimeout(() => { this.complianceTableLoading = true; }, 0);
    let requestBody = {};
    requestBody['complianceTaskType'] = this.selectedComplianceType;
    requestBody['currentTime'] = new Date().getTime();
    requestBody['buildingNameList'] = this.buildingList;

    this.sharedService.getStaffCompliance(this.buildingList[0], requestBody, this.selectedCompliancePageNo, 5)
      .pipe(map((complianceData: any) => {
        setTimeout(() => {
          console.log(complianceData)
          if (complianceData) {
            this.complianceData = complianceData;
          } else {
            this.complianceData = {
              pageDetails: {
                "page": 0,
                "size": 5,
                "totalPages": 0,
                "totalCount": 0
              },
              data: []
            };
          }
          this.complianceTableLoading = false;
        }, 0);
      }),
        catchError(errorData => {
          this.complianceData = {
            pageDetails: {
              "page": 0,
              "size": 5,
              "totalPages": 0,
              "totalCount": 0
            },
            data: []
          };
          this.complianceTableLoading = false;
          return of({});
        }),
        takeUntil(this.destroyAllSubscriptions))
      .subscribe(res => {
      });
  }
  /**
   * Get the user data
   * incident data and compliance data
   */
  ngOnInit() {
    this.chartOptions = CHART_CONFIG.incConstants.CHARTPROPERTIES;

    let mappedUserData = this.route.snapshot.data["resolvedUserData"];
    console.log(mappedUserData, "mappedUserData")
    this.buildingList = mappedUserData["buildingData"];
    this.userData = mappedUserData["userData"];


    if (this.buildingList.length == 1) {
      this.isAccessGranted = false;
      this.router.navigate(['/app/location/' + this.buildingList[0]]);
    }
    else {
      this.isAccessGranted = true;
      this.getNotificationsForLocation();
      this.getIncidentsCount();
      this.getIncidentsData();
      this.getComplianceData();
    }

    this.dashboardService
      .getShortageData()
      .pipe(
        map((resourceShortageData: any) => {
          this.resourceShortageData = resourceShortageData;
        }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => { });

    this.translation
      .translationChanged()
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(() => {
        this.welcomeText = this.translation.translate("welcomeText");
        this.openIncidentsText = this.translation.translate(
          "openIncidentsText"
        );
        this.resourceShortageText = this.translation.translate(
          "resourceShortageText"
        );
        this.staffCompTasksText = this.translation.translate(
          "staffCompTasksText"
        );
        this.newsFeedText = this.translation.translate("newsFeedText");
      });

    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(error => {
        if (error) {
          console.error(error);
        }
      });
  }

  /**
   * Unsubscribe all the service methods
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
