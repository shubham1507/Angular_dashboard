import { Component, OnInit, OnDestroy } from '@angular/core';
import { OverviewService } from '../../../services/overview.service';
import { SharedService } from 'src/app/services/shared.service';
import { CHART_CONFIG, TIME_RANGES } from "src/app/shared/const";
import { Subject, of, from } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {
  Language,
  DefaultLocale,
  LocaleService,
  TranslationService,
  DateTimeOptions
} from 'angular-l10n';
import * as moment from "moment";
import { COMPLIANCE_TYPES } from "src/app/shared/const";

/**
 * Component for the overv view functionality
 */
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  /**
   * Language decorator for translating the language texts
   */
  @Language() lang: string;

  /**
   * Default locale for the selected locale language
   */
  @DefaultLocale() defaultLocale: string;

  /**
   * Place holder for the open incidents text language key
   */
  openIncidentsText: string;


  /**
   * Place holder for the resource shortage text language key
   */
  resourceShortageText: string;


  /**
   * Place holder for the staff compliance tasks text language key
   */
  staffCompTasksText: string;


  /**
   * Place holder for the news feed items text language key
   */
  newsFeedItemsText: string;
  /**
   * incidents data tobe displayed in table
   */
  occurrenceData: any;
  /**
   * list of incident types
   */
  incidentTypeList: any[] = [];
  /**
   * guard deployment details to be shown in table format
   */
  deploymentDetails: any;
  /**
   * staff compliance table data
   */
  staffComplianceData: any;
  /**
   * classification based on compliance
   */
  roasterComplianceWise = COMPLIANCE_TYPES;

  selectedLocation: string;
  selectedIncidentPageNo: number = 1;
  incidentDateRange: Date[] = [
    new Date(moment().startOf('month').format()),
    new Date(moment().endOf('month').format())
  ];

  dateOptions: DateTimeOptions = { month: "short", day: "numeric" };

  timeRangeOptions: string[] = TIME_RANGES;

  tableLoading: boolean = false;
  incidentDetailsModal: boolean = false;
  selectedIncidentDetails: any;

  selectedComplianceType: string = "All";
  selectedCompliancePageNo: number = 1;
  complianceTableLoading: boolean = false;
  complianceData: any;

  //Adding the chart variables for overviewData


  /**
   * Place holder for the overview report constants for add clear btn
   */
  overviewConstants_addClearBtn: boolean = CHART_CONFIG.overviewConstants.CHARTPROPERTIES.ADDCLEARBTN;


  /**
   * Place holder for the overview report constants for right align btn
   */
  overviewConstants_rightAlign: boolean = CHART_CONFIG.overviewConstants.CHARTPROPERTIES.RIGHTALIGN;


  /**
   * Place holder for the overview report constants for chart options
   */
  overviewConstants_options: any;


  /**
   * Place holder for the overview report constants for add clear btn
   */
  overviewConstants_clearText = CHART_CONFIG.overviewConstants.CLEAR;


  /**
   * Place holder for the overview report constants for legend colors
   */
  overviewConstants_legendColors = CHART_CONFIG.overviewConstants.LEGENDCOLORS;


  /**
   * Place holder for the overview report constants for chart properties
   */
  overviewConstants_chartid = CHART_CONFIG.overviewConstants.CHARTPROPERTIES.CHARTID;

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();
  /**
   * Constructor function used to initialse the overview component
   */
  constructor(
    public locale: LocaleService,
    public translation: TranslationService,
    private overviewService: OverviewService,
    public sharedService: SharedService,
    private route: ActivatedRoute
  ) { }


  /**
   *clear the incident and reset the chart type data
   * for the incidents
   */
  clearFunction() {
  }

  /**
   * Populated the chart data for the selected incident type
   * @param selectedIncidentType
   */
  legendClick(selectedIncidentType: string) {

  }

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

  refreshIncidentTable(evt: any) {
    this.getIncidentsData();
  }

  getIncidentsCount() {
    let requestBody = {};
    requestBody['startDateTime'] = this.incidentDateRange[0].getTime();
    requestBody['endDateTime'] = this.incidentDateRange[1].getTime();
    requestBody['isBAUNormalEvent'] = false;
    requestBody['buildingNames'] = [this.selectedLocation];
    this.sharedService.getOccurrenceCount(this.selectedLocation, requestBody)
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

  getIncidentsData() {
    setTimeout(() => { this.tableLoading = true; }, 0);
    let requestBody = {
      "isBAUNormalEvent": false
    };
    requestBody['startDateTime'] = this.incidentDateRange[0].getTime();
    requestBody['endDateTime'] = this.incidentDateRange[1].getTime();

    this.sharedService.getOccurenceData(this.selectedLocation, requestBody, this.selectedIncidentPageNo, 7)
      .pipe(map((incidentsData: any) => {
        setTimeout(() => {
          console.log(incidentsData)
          if (incidentsData) {
            this.occurrenceData = incidentsData;
          } else {
            this.occurrenceData = {
              pageDetails: {
                "page": 0,
                "size": 7,
                "totalPages": 0,
                "totalCount": 0
              },
              data: []
            };
          }
          this.tableLoading = false;
        }, 0);
      }),
        catchError(errorData => {
          this.occurrenceData = {
            pageDetails: {
              "page": 0,
              "size": 7,
              "totalPages": 0,
              "totalCount": 0
            },
            data: []
          };
          this.tableLoading = false;
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
    requestBody['buildingNameList'] = [this.selectedLocation];

    this.sharedService.getStaffCompliance(this.selectedLocation, requestBody, this.selectedCompliancePageNo, 5)
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

  initLocData() {
    this.route.paramMap
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(paramsMap => {
        this.selectedLocation = paramsMap.get('selectedParam');
        this.selectedCompliancePageNo = 1;
        this.selectedIncidentPageNo = 1;
        this.getIncidentsCount();
        this.getIncidentsData();
        this.getComplianceData();
      })
  }

  /**
   * Init function is used to fetch the data required for overview component
   */
  ngOnInit() {
    this.overviewConstants_options = CHART_CONFIG.overviewConstants.CHARTPROPERTIES;

    this.translation.translationChanged().subscribe(
      () => {
        this.openIncidentsText = this.translation.translate('openIncidentsText');
        this.resourceShortageText = this.translation.translate('resourceShortageText');
        this.staffCompTasksText = this.translation.translate('staffCompTasksText');
        this.newsFeedItemsText = this.translation.translate('newsFeedItemsText');
      }
    );

    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe((error) => {
        if (error) {
          console.error(error);
        }
      });

    this.initLocData();

    this.overviewService.getDeploymentData()
      .pipe(map((deploymentDetails: any) => {
        this.deploymentDetails = deploymentDetails;
      }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => { })

    this.sharedService.getStaffDetails()
      .pipe(map((staffData: any) => {
        this.staffComplianceData = staffData.complianceRoaster;
        // this.roasterComplianceWise = Object.keys(staffData.complianceRoaster.complianceWeeklyWise);
      }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => { });
  }

  /**
   * Destroy life cycle hook for the overview component
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }

}
