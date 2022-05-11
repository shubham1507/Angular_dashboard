import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehicleParkingService } from '../../../../services/vehicle-parking.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CHART_CONFIG } from "src/app/shared/const";
import { ClrDatagridStateInterface } from "@clr/angular";
import { saveAs } from 'file-saver';
import * as moment from "moment";
import { VehicleCountData, VehicleReportData, FilterData } from './vehicle-data-models';
import {
  Language,
  DefaultLocale,
  LocaleService,
  Timezone,
  TranslationService,
  DateTimeOptions
} from 'angular-l10n';
import CalLocaleSwitch from 'src/app/shared/utils/cal-locale-switch';
import { Subject, of } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { DAY_IN_MS } from 'src/app/shared/const';

/**
 * Vehicle component for rendering the vehicle data
 */
@Component({
  selector: 'app-vehicle-parking',
  templateUrl: './vehicle-parking.component.html',
  styleUrls: ['./vehicle-parking.component.scss']
})
export class VehicleParkingComponent implements OnInit, OnDestroy {

  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;
  @Timezone() timezone: string;
  calLocale: Object;
  issuesReportedText: string;
  overnightParkingText: string;
  poolParkingViolationText: string;
  vipParkingViolationText: string;
  /**
   * vehicle parking table data
   */
  vehTrackData: any;
  /**
   * vehicle parking overview data
   */
  vehicleParkingOverview: any;
  /**
   * parking occupancy donut chart data
   */
  parkOccList: Object[];
  /**
   * vehicle types donut chart data
   */
  vehTypeDistList: Object[];
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

  dateOptions: DateTimeOptions = { month: 'short', day: 'numeric' };
  /**
   * start time for the data in the report
   */
  reportStartTime: Date;
  /**
   * end time for the data in the report
   */
  reportEndTime: Date;

  /**Flag to shoe the success alert modal for generate report */
  showSuccessAlert: boolean = false;

  /**Flag to show the error alert modal for generate report */
  showErrorAlert: boolean = false;

  /**Place holder used to store the error msg for the generate report functionality */
  fileDownloadError: string;

  /**Spinner loader flag shown when we are downloading the generate report function */
  showReportLoader: boolean = false;

  vehicleTypes: string[] = [];
  parkingTypes: string[] = [];

  //Adding the chart variables for parkOccConstants
  parkOccConstants_rightAlign: boolean = CHART_CONFIG.parkOccConstants.CHARTPROPERTIES.RIGHTALIGN;;
  parkOccConstants_chartid: String = CHART_CONFIG.parkOccConstants.CHARTPROPERTIES.CHARTID;
  parkOccConstants_addClearBtn: boolean = CHART_CONFIG.parkOccConstants.CHARTPROPERTIES.ADDCLEARBTN;
  parkOccConstants_legendColors: any = CHART_CONFIG.parkOccConstants.LEGENDCOLORS;
  parkOccConstants_options: any;

  // Adding the chart variable for the vehTypeDistrData
  vehTypeDistrData_rightAlign: boolean = CHART_CONFIG.vehTypeDistrData.CHARTPROPERTIES.RIGHTALIGN;;
  vehTypeDistrData_chartid: String = CHART_CONFIG.vehTypeDistrData.CHARTPROPERTIES.CHARTID;
  vehTypeDistrData_addClearBtn: boolean = CHART_CONFIG.vehTypeDistrData.CHARTPROPERTIES.ADDCLEARBTN;
  vehTypeDistrData_legendColors: any = CHART_CONFIG.vehTypeDistrData.LEGENDCOLORS;
  vehTypeDistrData_options: any;

  vehicleModal: any = {
    openvehicleModal: false,
  };

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();
  selectedLocation: string;

  totalParkingSlots: number = 0;
  totalVehicles: number = 0;
  newReportForm: FormGroup;
  selectedParkingType: string = "All Parking Spaces";
  selectedVehicleType: string = "All Vehicles";
  selectedPageNo: number = 1;
  tableLoading: boolean = false;
  dataError: boolean = false;

  /**
   * Constructor function used to initialse the vehicle parking component
   * @param vehicleParkingService
   */
  constructor(private vehicleParkingService: VehicleParkingService, public locale: LocaleService, public translation: TranslationService, private route: ActivatedRoute) { }

  selectParkingType(parkingType: string) {
    if (parkingType != 'VIP') {
      this.selectedParkingType = parkingType;
      this.selectedPageNo = 1;
      this.updateVehicleData();
    }
  }

  selectVehicleType(vehicleType: string) {
    this.selectedVehicleType = vehicleType;
    this.selectedPageNo = 1;
    this.updateVehicleData();
  }

  /**
   * selects date range filter
   * @param evt
   */
  selectDateRange(evt) {
    if (this.dateRange[0] && this.dateRange[1]) {
      this.dateRange[1] = new Date(moment(this.dateRange[1]).add(1, 'day').subtract(1, 'second').format());
      this.selectedPageNo = 1;
      this.updateVehicleData();
    }
  }

  refresh(state: ClrDatagridStateInterface) {
    this.updateVehicleData();
  }

  updateVehicleData() {
    setTimeout(() => { this.tableLoading = true; }, 0);

    let requestBody = {
      "size": 4
    };
    if (this.selectedParkingType != "All Parking Spaces") {
      requestBody['parkingAreaType'] = this.selectedParkingType;
    }
    if (this.selectedVehicleType != "All Vehicles") {
      requestBody['vehicleType'] = this.selectedVehicleType;
    }
    requestBody['page'] = this.selectedPageNo;
    if (this.dateRange && this.dateRange[0]) {
      requestBody['startDateTime'] = this.dateRange[0].getTime();
    }
    if (this.dateRange && this.dateRange[1]) {
      requestBody['endDateTime'] = this.dateRange[1].getTime();
    }

    this.vehicleParkingService.getVehicleTrackData(this.selectedLocation, requestBody)
      .pipe(map((vehicleTrackData: VehicleReportData) => {
        setTimeout(() => {
          this.vehTrackData = vehicleTrackData;
          this.tableLoading = false;
        }, 0);
      }),
        catchError(errorData => {
          this.vehTrackData = { report: [] };
          this.tableLoading = false;
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
        this.selectedLocation = paramsMap.get('selectedParam');
        let requestBody = {};
        requestBody['startDateTime'] = new Date(moment().startOf("day").format()).getTime();
        requestBody['endDateTime'] = new Date(moment().endOf("day").format()).getTime();
        this.vehicleParkingService.getVehicleParkingOverview(this.selectedLocation, requestBody)
          .pipe(map((vehicleParkingOverview: VehicleCountData) => {
            this.vehicleParkingOverview = vehicleParkingOverview;
            let availableParkings = this.vehicleParkingOverview.maxOccupancy - this.vehicleParkingOverview.totalCount;
            this.totalParkingSlots = this.vehicleParkingOverview.maxOccupancy;
            this.totalVehicles = this.vehicleParkingOverview.carsCount
              + this.vehicleParkingOverview.bikesCount
              + this.vehicleParkingOverview.cyclesCount;
            this.parkOccList = [
              { "key": "Available Parking", "y": availableParkings },
              { "key": "Current Occupancy", "y": this.vehicleParkingOverview.totalCount }];
            this.vehTypeDistList = [
              { "key": "Employee Vehicles - Cars", "y": this.vehicleParkingOverview.carsCount },
              { "key": "Employee Vehicles - Bikes", "y": this.vehicleParkingOverview.bikesCount },
              { "key": "Employee Vehicles - Cycles", "y": this.vehicleParkingOverview.cyclesCount }];
          }),
            catchError(errorData => {
              this.tableLoading = false;
              this.dataError = true;
              return of({});
            }),
            takeUntil(this.destroyAllSubscriptions)
          )
          .subscribe(res => { });

        this.vehicleParkingService.getVehicleTypes(this.selectedLocation)
          .pipe(map((vehicleTypes: FilterData) => {
            this.vehicleTypes = vehicleTypes.data;
          }),
            takeUntil(this.destroyAllSubscriptions)
          )
          .subscribe(res => { });

        this.vehicleParkingService.getParkingTypes(this.selectedLocation)
          .pipe(map((parkingTypes: FilterData) => {
            this.parkingTypes = parkingTypes.data;
          }),
            takeUntil(this.destroyAllSubscriptions)
          )
          .subscribe(res => { });

        this.updateVehicleData();
      });

  }

  onReportFormSubmit() {
    let requestBody = {};
    requestBody['startDateTime'] = this.newReportForm.value["reportDateRange"][0].getTime();
    if (this.newReportForm.value["reportDateRange"][1]) {
      requestBody["endDateTime"] = this.newReportForm.value["reportDateRange"][1].getTime() + DAY_IN_MS;
    }
    else {
      let currentTime = new Date().getTime();
      if (currentTime < this.newReportForm.value["reportDateRange"][0].getTime()) {
        requestBody["endDateTime"] = this.newReportForm.value["reportDateRange"][0].getTime();
      }
      else {
        requestBody["endDateTime"] = currentTime;
      }
    }
    requestBody['parkingAreaType'] = this.newReportForm.value['parkingType'];
    requestBody['vehicleType'] = this.newReportForm.value['vehicleType'];
    this.showReportLoader = true;
    this.vehicleParkingService.generateVehicleReport(this.selectedLocation, requestBody)
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(res => {
        if (res.body) {
          saveAs(res.body, "vehicle-report" + new Date().getTime() + ".xlsx");
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
        });
  }

  /**
   * shows vehicle report generating modal
   */
  openVehicleModal() {
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.showReportLoader = false;

    this.vehicleModal.openvehicleModal = true;

    this.newReportForm.reset();

    this.newReportForm['controls']['reportDateRange'].setValue([
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
    this.newReportForm['controls']['parkingType'].setValue('All');
    this.newReportForm['controls']['vehicleType'].setValue('All');
  }

  /**
   * Init function is used to fetch the data required for vehicle parking tab
   */
  ngOnInit() {
    this.parkOccConstants_options = CHART_CONFIG.parkOccConstants.CHARTPROPERTIES;
    this.vehTypeDistrData_options = CHART_CONFIG.vehTypeDistrData.CHARTPROPERTIES;

    this.translation.translationChanged()
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(
        (locale) => {
          this.calLocale = CalLocaleSwitch.getLocaleCalendarObj(locale);
          this.overnightParkingText = this.translation.translate('overnightParkingText');
          this.issuesReportedText = this.translation.translate('issuesReportedText');
          this.poolParkingViolationText = this.translation.translate('poolParkingViolationText');
          this.vipParkingViolationText = this.translation.translate('vipParkingViolationText');
        }
      );

    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe((error) => {
        if (error) {
          console.error(error);
        }
      });

    this.newReportForm = new FormGroup({
      parkingType: new FormControl('All'),
      vehicleType: new FormControl('All'),
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

    this.initLocData();
  }

  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }

}
