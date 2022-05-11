import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OccurrenceService } from '../../../../services/occurrence.service';
import { SharedService } from '../../../../services/shared.service';
import { CHART_CONFIG } from "src/app/shared/const";
import { takeUntil, map, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { OccurrenceListResponse } from './occurrence-api-models';
import * as moment from "moment";
import { saveAs } from "file-saver";
import { ClrDatagridStateInterface } from "@clr/angular";
import {
  Language,
  DefaultLocale,
  LocaleService,
  Timezone,
  TranslationService,
  DateTimeOptions
} from 'angular-l10n';
import CalLocaleSwitch from 'src/app/shared/utils/cal-locale-switch';
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import { DAY_IN_MS } from 'src/app/shared/const';

@Component({
  selector: 'app-occurrence',
  templateUrl: './occurrence.component.html',
  styleUrls: ['./occurrence.component.scss']
})
export class OccurrenceComponent implements OnInit, OnDestroy {

  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;
  @Timezone() timezone: string;
  calLocale: Object;
  incidentsReportedText: string;
  bussinessAsUsualText: string;
  highPriorityIncText: string;
  recentlyClosedIncText: string;

  dateOptions: DateTimeOptions = { month: "short", day: "numeric" };
  /**
   * occurence table data
   */
  occData: any;
  /**
   * incident type data for donut chart
   */
  incDistrDataByType: Object[] = [];
  /**
   * incident priority data for donut chart
   */
  incDistrDataByPriority: Object[] = [];
  /**
   * date range to display the data
   */
  dateRange: Date[] = [
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
  ];
  maxDateValue: Date = new Date(
    moment()
      .endOf("day")
      .format()
  );

  selectedLocation: string;
  selectedPageNo: number = 1;
  staffSearchData: any[] = [];
  selectedStaff: any;
  clearSearchButtonFlag: boolean = false;

  tableLoading: boolean = false;

  /**Flag to shoe the success alert modal for generate report */
  showSuccessAlert: boolean = false;

  /**Flag to show the error alert modal for generate report */
  showErrorAlert: boolean = false;

  /**Place holder used to store the error msg for the generate report functionality */
  fileDownloadError: string;

  /**Spinner loader flag shown when we are downloading the generate report function */
  showReportLoader: boolean = false;

  dataError: boolean = false;
  /**
   * Occurrence report form
   */
  newOccurrenceForm: FormGroup;
  occurrenceOverview: any;
  highPriorityOccCount: number;
  lowPriorityOccCount: number;


  // Adding the chart variables for the incDistrTypeData
  incDistrConstantsByType_rightAlign: boolean = CHART_CONFIG.incDistrByType.CHARTPROPERTIES.RIGHTALIGN;;
  incDistrConstantsByType_chartid: String = CHART_CONFIG.incDistrByType.CHARTPROPERTIES.CHARTID;
  incDistrConstantsByType_addClearBtn: boolean = CHART_CONFIG.incDistrByType.CHARTPROPERTIES.ADDCLEARBTN;
  incDistrConstantsByType_legendColors: any = CHART_CONFIG.incDistrByType.LEGENDCOLORS;
  incDistrConstantsByType_options: any;

  // Adding the chart variables for the incDistrPriorityData
  incDistrConstantsByPrior_rightAlign: boolean = CHART_CONFIG.incDistrByPrior.CHARTPROPERTIES.RIGHTALIGN;;
  incDistrConstantsByPrior_chartid: String = CHART_CONFIG.incDistrByPrior.CHARTPROPERTIES.CHARTID;
  incDistrConstantsByPrior_addClearBtn: boolean = CHART_CONFIG.incDistrByPrior.CHARTPROPERTIES.ADDCLEARBTN;
  incDistrConstantsByPrior_legendColors: any = CHART_CONFIG.incDistrByPrior.LEGENDCOLORS;
  incDistrConstantsByPrior_options: any;

  occurenceModal: any = {
    openOccurenceModal: false,
  };

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  /**
   * * Constructor function used to initialse the occurrence component
   * @param reportsService
   */
  constructor(
    private occurrenceService: OccurrenceService,
    public locale: LocaleService,
    public translation: TranslationService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) { }

  /**
   * shows occurrence report generating modal
   */
  openOccurenceModal() {
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.showReportLoader = false;
    this.occurenceModal.openOccurenceModal = true;
    this.newOccurrenceForm.reset();
    this.newOccurrenceForm["controls"]["reportDateRange"].setValue([
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
    this.occurenceModal.openOccurenceModal = true;
  }

  generateOccReport() {
    let requestBody: Object = {
      "shiftInfo": "shift-c"
    };
    requestBody["startDateTime"] = this.newOccurrenceForm.value[
      "reportDateRange"
    ][0].getTime();
    if (this.newOccurrenceForm.value["reportDateRange"][1]) {
      requestBody["endDateTime"] = this.newOccurrenceForm.value["reportDateRange"][1].getTime() + DAY_IN_MS;
    }
    else {
      let currentTime = new Date().getTime();
      if (currentTime < this.newOccurrenceForm.value["reportDateRange"][0].getTime()) {
        requestBody["endDateTime"] = this.newOccurrenceForm.value["reportDateRange"][0].getTime();
      }
      else {
        requestBody["endDateTime"] = currentTime;
      }
    }

    this.showReportLoader = true;
    this.occurrenceService
      .getOccurrenceReport(this.selectedLocation, requestBody)
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(
        data => {
          if (data.body) {
            saveAs(data.body, "occurrence-report" + new Date().getTime() + ".xls");
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
   * This method
   * @param event 
   */
  searchStaff(event) {
    if (event.query.length >= 3) {
      this.sharedService.searchSecurityPersonnel(event.query, this.selectedLocation)
        .pipe(map((searchResults: any) => {
          searchResults.data.forEach((element) => {
            element['fullName'] = element['firstName'] + " " + element['lastName'];
          });
          this.staffSearchData = searchResults.data;
        }),
          catchError(errorData => {
            return of({});
          }),
          takeUntil(this.destroyAllSubscriptions))
        .subscribe(res => {
        });
    }
  }

  /**
   * clears the staff search filter
   */
  clearSearchFilter() {
    this.selectedStaff = undefined;
    this.selectedPageNo = 1;
    this.updateOccurrenceData();
    this.clearSearchButtonFlag = false;
  }

  /**
   * refreshes table data after selecting staff member
   * @param event 
   */
  selectStaff(event) {
    this.clearSearchButtonFlag = true;
    console.log(this.selectedStaff);
    this.selectedPageNo = 1;
    this.updateOccurrenceData();
  }

  selectDateRange(evt) {
    if (this.dateRange[0] && this.dateRange[1]) {
      this.dateRange[1] = new Date(moment(this.dateRange[1]).add(1, 'day').subtract(1, 'second').format());
      this.selectedPageNo = 1;
      this.updateOccurrenceData();
    }
  }

  refresh(state: ClrDatagridStateInterface) {
    this.updateOccurrenceData();
  }

  updateOccurrenceData() {
    setTimeout(() => { this.tableLoading = true; }, 0);
    let requestBody = {};
    requestBody['startDateTime'] = this.dateRange[0].getTime();
    requestBody['endDateTime'] = this.dateRange[1].getTime();
    if (this.selectedStaff) {
      requestBody['occurrenceReportedByEmailId'] = this.selectedStaff.emailId;
    }
    this.occurrenceService.getOccurenceData(this.selectedLocation, requestBody, this.selectedPageNo, 5)
      .pipe(map((occurenceData: OccurrenceListResponse) => {
        setTimeout(() => {
          this.occData = occurenceData;
          this.tableLoading = false;
        }, 0);
      }),
        catchError(errorData => {
          this.occData = { data: [] };
          this.tableLoading = false;
          return of({});
        }),
        takeUntil(this.destroyAllSubscriptions))
      .subscribe(res => {
      });
  }

  fetchOverviewData() {
    let requestBody = {};
    requestBody['startDateTime'] = new Date(moment().startOf("day").format()).getTime();
    requestBody['endDateTime'] = new Date(moment().endOf("day").format()).getTime();
    requestBody['isBAUNormalEvent'] = true;
    requestBody['buildingNames'] = [this.selectedLocation];

    this.sharedService.getOccurrenceCount(this.selectedLocation, requestBody)
      .pipe(map((occurrenceOverview) => {
        this.occurrenceOverview = occurrenceOverview || { data: {} };
        console.log(occurrenceOverview, "occurrenceOverview")
        if (this.occurrenceOverview.data.occurrenceTypeCount) {
          let lowPriority = this.occurrenceOverview.data.occurrenceTypeCount.find((element) => {
            return element.occurrenceType == "BAU-Event-Normal"
          });
          let highPriority = this.occurrenceOverview.data.occurrenceTypeCount.find((element) => {
            return element.occurrenceType == "NON-BAU-Incident-Report"
          });
          this.lowPriorityOccCount = lowPriority ? lowPriority.count : 0;
          this.highPriorityOccCount = highPriority ? highPriority.count : 0;
        }
        else {
          this.lowPriorityOccCount = 0;
          this.highPriorityOccCount = 0;
        }
        this.incDistrDataByPriority = [{ "key": "High", "y": this.highPriorityOccCount }, { "key": "Low", "y": this.lowPriorityOccCount }];
        if (this.occurrenceOverview.data.incidentTypeCount) {
          this.incDistrDataByType = [];
          this.occurrenceOverview.data.incidentTypeCount.forEach((element) => {
            let incidentTypeObject = {
              "key": element.incidentType,
              "y": element.count
            };
            this.incDistrDataByType.push(incidentTypeObject);
          });
        }
        else {
          this.incDistrDataByType = [{ "key": "Open Incidents", "y": 0 }];
        }
      }),
        catchError(errorData => {
          // this.tableLoading = false;
          this.dataError = true;
          return of({ data: {} });
        }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => {
      });

  }

  initLocData() {
    this.route.paramMap
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(paramsMap => {
        this.selectedLocation = paramsMap.get('selectedParam');
        this.fetchOverviewData();
        this.updateOccurrenceData();
      })
  }
  /**
   * Init function is used to fetch the data required for occurrence tab
   */
  ngOnInit() {
    this.incDistrConstantsByType_options = CHART_CONFIG.incDistrByType.CHARTPROPERTIES;
    this.incDistrConstantsByPrior_options = CHART_CONFIG.incDistrByPrior.CHARTPROPERTIES;
    // this.incDistrDataByType = [{ "key": "Missing Incident", "y": "6" }, { "key": "Medical Incident", "y": "3" }, { "key": "Transport Incident", "y": "4" }, { "key": "Near Miss Incident ", "y": "2" }, { "key": "Employee Incident", "y": "7" }, { "key": "Other Incident", "y": "6" }, { "key": "Approvals", "y": "7" }];

    this.translation.translationChanged()
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(
        (locale) => {
          this.calLocale = CalLocaleSwitch.getLocaleCalendarObj(locale);
          this.bussinessAsUsualText = this.translation.translate('bussinessAsUsualText');
          this.highPriorityIncText = this.translation.translate('highPriorityIncText');
          this.incidentsReportedText = this.translation.translate('incidentsReportedText');
          this.recentlyClosedIncText = this.translation.translate('recentlyClosedIncText');
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
    this.newOccurrenceForm = new FormGroup({
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
      ])
    });
  }

  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }

}
