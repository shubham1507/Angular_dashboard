import { Component, OnInit, OnDestroy } from "@angular/core";
import { MaterialService } from "../../../../services/material.service";
import { forkJoin, Subject, of } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { map, takeUntil, catchError } from "rxjs/operators";
import {
  MaterialReportData,
  MaterialLogCountData
} from "./material-api-models";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import { ClrDatagridStateInterface } from "@clr/angular";
import { saveAs } from "file-saver";
import * as moment from "moment";
import { CHART_CONFIG } from "src/app/shared/const";

import {
  Language,
  DefaultLocale,
  LocaleService,
  Timezone,
  TranslationService,
  DateTimeOptions
} from "angular-l10n";
import CalLocaleSwitch from "src/app/shared/utils/cal-locale-switch";
import { DAY_IN_MS } from 'src/app/shared/const';

/**
 * Material component for rendering the material data
 */
@Component({
  selector: "app-material",
  templateUrl: "./material.component.html",
  styleUrls: ["./material.component.scss"]
})
export class MaterialComponent implements OnInit, OnDestroy {
  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;
  @Timezone() timezone: string;
  calLocale: Object;
  issuesReportedText: string;
  incompleteTransText: string;
  outwardMatEntriesText: string;
  inwardMatEntriesText: string;
  /**
   * material table data
   */
  materialData: any;
  /**
   * material tab overview data(counts)
   */
  materialOverviewData: any = {};
  /**
   * material transaction status data for donut chart
   */
  matTransStatusData: Object[];
  /**
   * material transaction type data for donut chart
   */
  matTransTypeData: Object[];

  /**
   * selected movement type
   */
  selectedMovementType: string = "";
  /**
   * selected entry type
   */
  selectedEntryType: string = "";
  /**
   * material table state (contains sorting, filter details)
   */
  materialTableState: any;
  /**
   * page no of current page
   */
  materialTablePageNo = 1;
  /**
   * flag to show/hide loading spinner
   */
  materialTableLoading: boolean = false;

  pageLoading: boolean = true;
  /**
   * selected value from dropdown
   */
  selectedFilterValue = "All Types";
  /**
   * selected value from dropdown
   */
  selectedFilterValue1 = "All Entry Types";
  /**
   * date range for the material data to be dispayed
   */
  materialDateRange: Date[] = [
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

  dateOptions: DateTimeOptions = { month: "short", day: "numeric" };
  /**
   * start time for the data in the report
   */
  materialReportStartTime: Date;
  /**
   * end time for the data in the report
   */
  materialReportEndTime: Date;

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
   * material report form
   */
  newMaterialForm: FormGroup;
  test = false;
  matTransTotal: number = 0;

  // Adding the chart variables for the material Transaction Status
  matTransStatusConstant_rightAlign: boolean =
    CHART_CONFIG.matTransStatus.CHARTPROPERTIES.RIGHTALIGN;
  matTransStatusConstant_chartid: String =
    CHART_CONFIG.matTransStatus.CHARTPROPERTIES.CHARTID;
  matTransStatusConstant_addClearBtn: boolean =
    CHART_CONFIG.matTransStatus.CHARTPROPERTIES.ADDCLEARBTN;
  matTransStatusConstant_legendColors: any =
    CHART_CONFIG.matTransStatus.LEGENDCOLORS;
  matTransStatusConstant_options: any;

  // Adding the chart variables for the material Transaction Type
  matTransTypeConstant_rightAlign: boolean =
    CHART_CONFIG.matTransType.CHARTPROPERTIES.RIGHTALIGN;
  matTransTypeConstant_chartid: String =
    CHART_CONFIG.matTransType.CHARTPROPERTIES.CHARTID;
  matTransTypeConstant_addClearBtn: boolean =
    CHART_CONFIG.matTransType.CHARTPROPERTIES.ADDCLEARBTN;
  matTransTypeConstant_legendColors: any =
    CHART_CONFIG.matTransType.LEGENDCOLORS;
  matTransTypeConstant_options: any;

  materialModal: any = {
    openmaterialModal: false
  };
  selectedLocation: string;

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  /**
   * Constructor function used to initialse the material component
   * @param reportsService
   * @param formBuilder
   */
  constructor(
    private materialService: MaterialService,
    private formBuilder: FormBuilder,
    public locale: LocaleService,
    public translation: TranslationService,
    private route: ActivatedRoute
  ) { }

  /**
   * shows material report generating modal
   */
  openMaterialModal() {
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.showReportLoader = false;
    this.materialModal.openmaterialModal = true;
    this.newMaterialForm.reset();
    this.newMaterialForm["controls"]["reportDateRange"].setValue([
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
    this.newMaterialForm["controls"]["movementType"].setValue("All");
    this.newMaterialForm["controls"]["itemType"].setValue("All");
  }

  /**
   * refreshes the table data when state changes
   * @param state
   */
  refresh(state: ClrDatagridStateInterface) {
    this.materialTableState = state;
    this.updateMaterialData();
  }

  /**
   * submits the request for generating the report in xls format
   */
  onMaterialSubmit() {
    let requestBody: Object = {};
    requestBody["startTime"] = this.newMaterialForm.value[
      "reportDateRange"
    ][0].getTime();
    if (this.newMaterialForm.value["reportDateRange"][1]) {
      requestBody["endTime"] = this.newMaterialForm.value["reportDateRange"][1].getTime() + DAY_IN_MS;
    }
    else {
      let currentTime = new Date().getTime();
      if (currentTime < this.newMaterialForm.value["reportDateRange"][0].getTime()) {
        requestBody["endTime"] = this.newMaterialForm.value["reportDateRange"][0].getTime();
      }
      else {
        requestBody["endTime"] = currentTime;
      }
    }

    if (this.newMaterialForm.value["movementType"] != "All") {
      requestBody["materialMovementType"] = this.newMaterialForm.value[
        "movementType"
      ];
    } else {
      requestBody["materialMovementType"] = null;
    }

    if (this.newMaterialForm.value["itemType"] != "All") {
      requestBody["itemType"] = this.newMaterialForm.value["itemType"];
    } else {
      requestBody["itemType"] = null;
    }

    this.showReportLoader = true;
    this.materialService
      .getMaterialReport(requestBody, this.selectedLocation)
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(
        data => {
          if (data.body) {
            saveAs(data.body, "material-report" + new Date().getTime() + ".xls");
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
   * selects filter movement type
   * @param movementType
   * @param evt
   */
  selectMovementType(movementType: string, evt) {
    this.selectedFilterValue = evt.currentTarget.innerText;
    this.selectedMovementType = movementType;
    this.materialTablePageNo = 1;
    this.updateMaterialData();
  }

  /**
   * selects filter entry type
   * @param entryType
   * @param evt
   */
  selectEntryType(entryType: string, evt) {
    this.selectedFilterValue1 = evt.currentTarget.innerText;
    this.selectedEntryType = entryType;
    this.materialTablePageNo = 1;
    this.updateMaterialData();
  }

  /**
   * selects date range filter
   * @param evt
   */
  selectDateRange(evt) {
    if (this.materialDateRange[0] && this.materialDateRange[1]) {
      this.materialDateRange[1] = new Date(moment(this.materialDateRange[1]).add(1, 'day').subtract(1, 'second').format());
      this.materialTablePageNo = 1;
      this.updateMaterialData();
    }
  }

  /**
   * updates material table data when any filter or sorting is changed
   */
  updateMaterialData() {
    // As per the  clarity issue  : https://github.com/vmware/clarity/issues/1519 explained happens only for mock data
    //TODO: We added timeout as a work around for loading flag , need to validate and remove at the time of Api Integration
    setTimeout(() => {
      this.materialTableLoading = true;
    }, 0);

    let materialRequestBody = {};
    if (this.selectedMovementType)
      materialRequestBody["materialMovementType"] = this.selectedMovementType;
    if (this.selectedEntryType)
      materialRequestBody["itemType"] = this.selectedEntryType;
    materialRequestBody["pageNumber"] = this.materialTablePageNo;
    materialRequestBody["pageSize"] = 5;
    if (this.materialTableState && this.materialTableState.sort) {
      materialRequestBody["sortBy"] = this.materialTableState.sort.by;
      materialRequestBody["reverse"] = this.materialTableState.sort.reverse;
    }
    if (this.materialDateRange && this.materialDateRange[0]) {
      materialRequestBody["startTime"] = this.materialDateRange[0].getTime();
    }
    if (this.materialDateRange && this.materialDateRange[1]) {
      materialRequestBody["endTime"] = this.materialDateRange[1].getTime();
    }
    this.materialService
      .getMaterialData(materialRequestBody, this.selectedLocation)
      .pipe(
        map((materialData: MaterialReportData) => {
          setTimeout(() => {
            this.materialData = materialData;
            this.materialTableLoading = false;
          }, 0);
        }),
        catchError(errorData => {
          this.materialData = { data: [] };
          this.materialTableLoading = false;
          return of({});
        }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => { });
  }

  initLocData() {
    this.route.paramMap
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(paramsMap => {
        this.selectedLocation = paramsMap.get("selectedParam");

        let startTime = new Date(moment().startOf("day").format()).getTime();
        let endTime = new Date(moment().endOf("day").format()).getTime();

        this.materialService.getMaterialLogCount(
          this.selectedLocation,
          startTime,
          endTime)
          .pipe(map((response: any) => {
            let materialCounts = {};
            response.data.forEach((transactionType) => {
              materialCounts[transactionType.countType] = transactionType.count;
            });

            this.materialOverviewData["inwardLogCount"] =
              materialCounts['INWARD'] || 0;
            this.materialOverviewData["outwardLogCount"] =
              materialCounts['OUTWARD'] || 0;
            this.materialOverviewData["returnableLogCount"] =
              materialCounts['RETURNABLE'] || 0;
            this.materialOverviewData["nonReturnableLogCount"] =
              materialCounts['NONRETURNABLE'] || 0;
            this.materialOverviewData["completeTransLogCount"] =
              materialCounts['COMPLETE'] || 0;
            this.materialOverviewData["incompleteTransLogCount"] =
              materialCounts['INCOMPLETE'] || 0;
            this.materialOverviewData["issuesLogCount"] =
              materialCounts['ISSUEREPORTED'] || 0;

            this.matTransTotal = materialCounts['RETURNABLE'] || 0 + materialCounts['NONRETURNABLE'] || 0;
            this.matTransStatusData = [
              {
                key: "Incomplete Transactions",
                y: this.materialOverviewData["incompleteTransLogCount"]
              },
              {
                key: "Complete Transactions",
                y: this.materialOverviewData["completeTransLogCount"]
              }
            ];
            this.matTransTypeData = [
              {
                key: "Returnable",
                y: this.materialOverviewData["returnableLogCount"]
              },
              {
                key: "Non-Returnable",
                y: this.materialOverviewData["nonReturnableLogCount"]
              }
            ];
            this.pageLoading = false;
          }),
            catchError(errorData => {
              this.pageLoading = false;
              this.dataError = true;
              return of({});
            }),
            takeUntil(this.destroyAllSubscriptions)
          )
          .subscribe(res => { });
        this.updateMaterialData();
      });
  }

  /**
   * * Init function is used to fetch the initial data required for material tab
   */
  ngOnInit() {
    this.matTransStatusConstant_options =
      CHART_CONFIG.matTransStatus.CHARTPROPERTIES;
    this.matTransTypeConstant_options =
      CHART_CONFIG.matTransType.CHARTPROPERTIES;

    this.translation
      .translationChanged()
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(locale => {
        this.calLocale = CalLocaleSwitch.getLocaleCalendarObj(locale);
        this.incompleteTransText = this.translation.translate(
          "incompleteTransText"
        );
        this.inwardMatEntriesText = this.translation.translate(
          "inwardMatEntriesText"
        );
        this.issuesReportedText = this.translation.translate(
          "issuesReportedText"
        );
        this.outwardMatEntriesText = this.translation.translate(
          "outwardMatEntriesText"
        );
      });

    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(error => {
        if (error) {
          console.error(error);
        }
      });
    this.initLocData();

    this.newMaterialForm = new FormGroup({
      movementType: new FormControl("All"),
      itemType: new FormControl("All"),
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

  /**
   * Destroy life cycle hook for the material component
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
