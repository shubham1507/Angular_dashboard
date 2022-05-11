import { Component, OnInit, OnDestroy } from "@angular/core";
import { CabTrackingService } from "../../../../services/cab-tracking.service";
import {
  CHART_CONFIG,
  ALL_SERVICE_TYPES,
  ALL_PARAMETER_TYPES,
  WOMEN_PASSENGERS,
  ISSUES_REPORTED
} from "src/app/shared/const";
import * as moment from "moment";

import {
  Language,
  DefaultLocale,
  LocaleService,
  TranslationService
} from "angular-l10n";
import CalLocaleSwitch from "src/app/shared/utils/cal-locale-switch";
import { combineLatest, Subject, of } from "rxjs";
import { map, take, takeUntil, catchError } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { cabOverViewModalData } from "./cablog-model";
import { ClrDatagridStateInterface } from "@clr/angular";
import { FormGroup, FormControl } from "@angular/forms";
import { DAY_IN_MS } from 'src/app/shared/const';

/**Component for the cab tracking functionality */
@Component({
  selector: "app-cab-tracking",
  templateUrl: "./cab-tracking.component.html",
  styleUrls: ["./cab-tracking.component.scss"]
})
export class CabTrackingComponent implements OnInit, OnDestroy {
  /**Language decorator used to translate the languages */
  @Language() lang: string;

  /**locale used to provide the context of the selected locale */
  @DefaultLocale() defaultLocale: string;

  /**Calendar locale used to localise the calendar */
  calLocale: Object;

  /* Place holder label to show the issue reported text   */
  issuesReportedText: string;

  /* Place holder label to show the cabs with escort text   */
  cabsWithEscortText: string;

  /* Place holder label to show the women passengers text   */
  womenPassengersText: string;

  /* Place holder label to show the trips completed text   */
  tripsCompletedText: string;

  /**
   * cab tracking table data
   */
  cabData: any;
  /**
   * trip status data for donut chart
   */
  tripStatusData: Object[];
  /**
   * cab type data for donut chart
   */
  cabTypeDistrData: Object[];

  /**Adding the chart variables for the tripStatus */
  tripStatusConstants_rightAlign: boolean =
    CHART_CONFIG.tripStatus.CHARTPROPERTIES.RIGHTALIGN;
  tripStatusConstants_chartid: String =
    CHART_CONFIG.tripStatus.CHARTPROPERTIES.CHARTID;
  tripStatusConstants_addClearBtn: boolean =
    CHART_CONFIG.tripStatus.CHARTPROPERTIES.ADDCLEARBTN;
  tripStatusConstants_legendColors: any = CHART_CONFIG.tripStatus.LEGENDCOLORS;
  tripStatusConstants_options: any;

  /**Adding the chart variables for the cabtype distribution */
  cabTypeDistr_rightAlign: boolean =
    CHART_CONFIG.cabTypeDistr.CHARTPROPERTIES.RIGHTALIGN;
  cabTypeDistr_chartid: String =
    CHART_CONFIG.cabTypeDistr.CHARTPROPERTIES.CHARTID;
  cabTypeDistr_addClearBtn: boolean =
    CHART_CONFIG.cabTypeDistr.CHARTPROPERTIES.ADDCLEARBTN;
  cabTypeDistr_legendColors: any = CHART_CONFIG.cabTypeDistr.LEGENDCOLORS;
  cabTypeDistr_options: any;

  /**
   * Conditional flag to open the cab modal
   */
  cabModal: any = {
    opencabModal: false
  };

  /**place holder to store the caboverview data */
  cabOverViewData: Object;
  /**place holder to store the caboverview data */
  cabLogData: Object;


  /** pagination index for the cab log table */
  cabLogTablePageNo = 1;

  /**place holder for the selected office location */
  selectedOfficeLocation: string;

  /**Spinner loader flag for the cab log data table */
  cabLogTableLoading: boolean = false;

  /**Place holder to store the service type data for by type filter */
  cabServiceTypes: String[];

  /**place holder to store the parameter data for the By parameter filter */
  cabAllParameters: String[] = [
    "All Parameters",
    "Issues Reported",
    "Women Passengers"
  ];

  /**place holder for the form for the generate report functionality */
  cabReportForm: FormGroup;

  /**
   * date range to display the data
   */

  cabDateRange: Date[] = [
    new Date(
      moment()
        .startOf("day")
        .format()
    ),
    new Date()
  ];
  maxDateValue: Date = new Date(
    moment()
      .endOf("day")
      .format()
  );

  /**place holder to store the by type selected filter value */
  selectedByType: String = ALL_SERVICE_TYPES;

  /**place holder to store rhe selectedParameterType filter value  */
  selectedParameterType: String = ALL_PARAMETER_TYPES;


  /**Flag to shoe the success alert modal for generate report */
  showSuccessAlert: boolean = false;

  /**Flag to show the error alert modal for generate report */
  showErrorAlert: boolean = false;

  /**Place holder used to store the error msg for the generate report functionality */
  fileDownloadError: string;

  /**Spinner loader flag shown when we are downloading the generate report function */
  showReportLoader: boolean = false;

  dataError: boolean = false;

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  tripStatusTotal: number = 0;
  cabDistTotal: number = 0;

  /**
   * Constructor function used to initialse the cab tracking component
   * @param reportsService
   */
  constructor(
    private route: ActivatedRoute,
    private cabTrackingService: CabTrackingService,
    public locale: LocaleService,
    public translation: TranslationService
  ) { }

  /**
   * shows cab tracking report generating modal
   */
  openCabModal() {
    this.cabModal.opencabModal = true;

    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.showReportLoader = false;

    this.cabReportForm.reset();
    this.cabReportForm['controls']['reportDateRange'].setValue([
      new Date(
        moment()
          .startOf("day")
          .format()
      ),
      new Date(
        moment()
          .endOf("day")
          .format()
      )
    ]);
    this.cabReportForm['controls']['serviceType'].setValue(ALL_SERVICE_TYPES);
    this.cabReportForm['controls']['paramterType'].setValue(ALL_PARAMETER_TYPES);
  }

  /**
   * Function called when we select the by type filter
   * @param evt
   */
  selectByType(evt) {
    this.selectedByType = evt.currentTarget.innerText;
    this.cabLogTablePageNo = 1;

    this.fetchCabLogData();
  }

  /**
   * Function called when we select the parameter type filter
   * @param evt
   */
  selectParameterType(evt) {
    this.selectedParameterType = evt.currentTarget.innerText;
    this.cabLogTablePageNo = 1;

    this.fetchCabLogData();
  }

  /**
   * selects date range filter
   * @param evt
   */
  selectDateRange(evt) {
    if (this.cabDateRange[0] && this.cabDateRange[1]) {
      this.cabDateRange[1] = new Date(moment(this.cabDateRange[1]).add(1, 'day').subtract(1, 'second').format());
      this.cabLogTablePageNo = 1;
      this.fetchCabLogData();
    }
  }

  /**
   * Function to fetch the table data for the cab log
   */
  fetchCabLogData() {
    //Assigning the headers data
    let optionsData = { "X-BuildingName": typeof (this.selectedOfficeLocation) == "undefined" ? '' : this.selectedOfficeLocation };
    let options = { headers: optionsData };

    //Assigning the log Data
    let logData = {};

    logData["endDateTime"] = this.cabDateRange[1].getTime();
    logData["startDateTime"] = this.cabDateRange[0].getTime();
    logData["size"] = 10;
    logData["page"] = this.cabLogTablePageNo;

    logData["serviceType"] = this.selectedByType;

    if (this.selectedParameterType == ALL_PARAMETER_TYPES) {

    }

    if (this.selectedParameterType == ISSUES_REPORTED) {
      logData["issuesReported"] = true;
      logData["womanPassanger"] = false;
    }

    if (this.selectedParameterType == WOMEN_PASSENGERS) {
      logData["issuesReported"] = false;
      logData["womanPassanger"] = true;
    }

    setTimeout(() => {
      this.cabLogTableLoading = true;
    }, 0);

    combineLatest(
      this.cabTrackingService.getCabLog(options, logData),
      this.cabTrackingService.getCabServiceTypes(options)
    )
      .pipe(
        take(1),
        catchError(errorData => {
          return of([{ data: [] }, { data: [] }]);
        }

        ),
        takeUntil(this.destroyAllSubscriptions))
      .subscribe(([cabLogData, cabServiceTypes]) => {
        this.cabLogData = cabLogData;
        this.cabServiceTypes = cabServiceTypes.data;
        this.cabServiceTypes.splice(0, 0, ALL_SERVICE_TYPES);
        this.cabLogTableLoading = false;
      });
  }

  /**
   * Function to generate the cab report
   */
  generateCabReport() {
    let requestBody: Object = {};
    requestBody["startDateTime"] = this.cabReportForm.value[
      "reportDateRange"
    ][0].getTime();
    if (this.cabReportForm.value["reportDateRange"][1]) {
      requestBody["endDateTime"] = this.cabReportForm.value["reportDateRange"][1].getTime() + DAY_IN_MS;
    }
    else {
      let currentTime = new Date().getTime();
      if (currentTime < this.cabReportForm.value["reportDateRange"][0].getTime()) {
        requestBody["endDateTime"] = this.cabReportForm.value["reportDateRange"][0].getTime();
      }
      else {
        requestBody["endDateTime"] = currentTime;
      }
    }

    requestBody["serviceType"] = this.cabReportForm.value["serviceType"];

    if (this.cabReportForm.value["paramterType"] == ALL_PARAMETER_TYPES) {
      requestBody["issuesReported"] = true;
      requestBody["womanPassanger"] = true;
    }

    if (this.cabReportForm.value["paramterType"] == ISSUES_REPORTED) {
      requestBody["issuesReported"] = true;
      requestBody["womanPassanger"] = false;
    }

    if (this.cabReportForm.value["paramterType"] == WOMEN_PASSENGERS) {
      requestBody["issuesReported"] = false;
      requestBody["womanPassanger"] = true;
    }

    //Assigning the headers data
    let buildingHeader = { "X-BuildingName": typeof (this.selectedOfficeLocation) == "undefined" ? '' : this.selectedOfficeLocation };

    this.showReportLoader = true;
    this.cabTrackingService.getCabReport(buildingHeader, requestBody).
      pipe(
        takeUntil(this.destroyAllSubscriptions)
      ).
      subscribe(
        data => {
          if (data.body) {
            saveAs(data.body, "cab-report_" + new Date().getTime() + ".csv");
            this.showSuccessAlert = true;
            this.showErrorAlert = false;
          }
          else {
            this.showErrorAlert = true;
            this.showSuccessAlert = false;
            this.fileDownloadError = 'No data found!';
          }
          this.showReportLoader = false;
        },
        error => {
          this.showErrorAlert = true;
          this.showSuccessAlert = false;
          this.fileDownloadError = error.message;
          this.showReportLoader = false;
        }
      );
  }

  /**
   * refreshes the table data when state changes
   * @param state
   */
  refresh(state: ClrDatagridStateInterface) {
    this.fetchCabLogData();
  }

  /**
   * Function to fetch the overview data for cards and reports
   */
  fetchOverViewData() {
    //Assigning the headers data
    let optionsData = { "X-BuildingName": typeof (this.selectedOfficeLocation) == "undefined" ? '' : this.selectedOfficeLocation };
    let options = { headers: optionsData };

    //Assigning the overview body data
    let overViewPostData = {};
    let startOfDay = new Date(
      moment()
        .startOf("day")
        .format()
    ).getTime();
    let endTime = new Date().getTime();

    overViewPostData["endDateTime"] = endTime;
    overViewPostData["startDateTime"] = startOfDay;
    overViewPostData["issuesReported"] = true;
    overViewPostData["womanPassanger"] = true;
    overViewPostData["serviceType"] = ALL_SERVICE_TYPES;

    this.cabTrackingService
      .getCabOverviewData(options, overViewPostData)
      .pipe(
        map((cabOverViewData: cabOverViewModalData) => {
          setTimeout(() => {
            this.cabOverViewData = cabOverViewData;
            let tripsCompletedData = this.mapReportData(
              "Trips Completed",
              this.cabOverViewData["tripsCompleted"]
            );
            let tripsPendingData = this.mapReportData(
              "Trips Pending",
              this.cabOverViewData["tripsPending"]
            );

            let escortedData = this.mapReportData(
              "Cabs with Escort",
              this.cabOverViewData["escortGuard"]
            );
            let withoutEscortedData = this.mapReportData(
              "Cabs without Escort",
              this.cabOverViewData["withoutEscortGuard"]
            );
            this.tripStatusTotal = this.cabOverViewData["tripsCompleted"] + this.cabOverViewData["tripsPending"];
            this.cabDistTotal = this.cabOverViewData["escortGuard"] + this.cabOverViewData["withoutEscortGuard"];

            this.tripStatusData = [tripsCompletedData, tripsPendingData];
            this.cabTypeDistrData = [escortedData, withoutEscortedData];
          }, 0);
        }),
        catchError(errorData => {
          this.cabLogTableLoading = false;
          this.dataError = true;
          return of({});
        }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => { });
  }

  /**
   * Function to initiate the data fetch for overview and cab log data
   */
  fetchCabData() {
    this.route.paramMap
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(paramsMap => {
        this.selectedOfficeLocation = paramsMap.get("selectedParam");
        // Fetch the cab overview data and cab log data
        this.fetchOverViewData();
        this.fetchCabLogData();
      });
  }

  /**
   * Function to return the report formatted data
   * @param key
   * @param value
   */
  mapReportData(key, value) {
    let reportData = {};
    reportData["key"] = key;
    reportData["y"] = value;

    return reportData;
  }

  /**
   * Init function is used to fetch the data required for cab tracking tab
   */
  ngOnInit() {
    this.tripStatusConstants_options = CHART_CONFIG.tripStatus.CHARTPROPERTIES;
    this.cabTypeDistr_options = CHART_CONFIG.cabTypeDistr.CHARTPROPERTIES;

    this.translation.translationChanged()
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(locale => {
        this.calLocale = CalLocaleSwitch.getLocaleCalendarObj(locale);
        this.tripsCompletedText = this.translation.translate(
          "tripsCompletedText"
        );
        this.cabsWithEscortText = this.translation.translate(
          "cabsWithEscortText"
        );
        this.issuesReportedText = this.translation.translate(
          "issuesReportedText"
        );
        this.womenPassengersText = this.translation.translate(
          "womenPassengersText"
        );
      });

    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe((error) => {
        if (error) {
          console.error(error);
        }
      });

    this.fetchCabData();

    this.cabReportForm = new FormGroup({
      reportDateRange: new FormControl([
        new Date(
          moment()
            .startOf("day")
            .format()
        ),
        new Date(
          moment()
            .endOf("day")
            .format()
        )
      ]),
      serviceType: new FormControl(ALL_SERVICE_TYPES),
      paramterType: new FormControl(ALL_PARAMETER_TYPES)
    });
  }

  /**Destroy life cycle hook for the cab tracking component */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
