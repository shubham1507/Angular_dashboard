import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttendanceService } from 'src/app/services/attendance.service';
import { SharedService } from '../../../../services/shared.service';
import { CHART_CONFIG } from "src/app/shared/const";
import { takeUntil, map, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import * as moment from "moment";
import { ClrDatagridStateInterface } from "@clr/angular";
import { AutoCompleteModule } from 'primeng/autocomplete';
import {
  Language,
  DefaultLocale,
  LocaleService,
  Timezone,
  TranslationService,
  DateTimeOptions
} from 'angular-l10n';
import CalLocaleSwitch from 'src/app/shared/utils/cal-locale-switch';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit, OnDestroy {

  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;
  @Timezone() timezone: string;
  calLocale: Object;
  allStaffText: string;
  staffOnLeaveText: string;
  femaleStaffText: string;
  incidentsReportedText: string;

  dateOptions: DateTimeOptions = { month: "short", day: "numeric" };
  /**
   * attendance data displayed in table
   */
  attendanceData: any;
  /**
   * rolewise distribution data for donut chart
   */
  roleWiseDistrData: Object[];
  /**
   * demographic distribution data for donut chart
   */
  demoGraphDistrData: Object[];
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

  selectedLocation: string;

  dataError: boolean = false;

  staffCount: any;

  guardCount: number;
  supervisorCount: number;
  managerCount: number;
  femaleStaffCount: number;
  selectedPageNo: number = 1;
  tableLoading: boolean = false;

  selectedFilterRole = "All Roles";
  selectedRole = '';
  staffSearchData: any[] = [];
  selectedStaff: any;
  clearSearchButtonFlag: boolean = false;

  // Adding the chart variables for the rate wise distribuition
  rateWiseDistrConstant_rightAlign: boolean = CHART_CONFIG.rateWiseDistr.CHARTPROPERTIES.RIGHTALIGN;;
  rateWiseDistrConstant_chartid: String = CHART_CONFIG.rateWiseDistr.CHARTPROPERTIES.CHARTID;
  rateWiseDistrConstant_addClearBtn: boolean = CHART_CONFIG.rateWiseDistr.CHARTPROPERTIES.ADDCLEARBTN;
  rateWiseDistrConstant_legendColors: any = CHART_CONFIG.rateWiseDistr.LEGENDCOLORS;
  rateWiseDistrConstant_options: any;


  // Adding the chart variables for the rate wise distribuition
  demoGraphDistrConstant_rightAlign: boolean = CHART_CONFIG.demoGraphDistr.CHARTPROPERTIES.RIGHTALIGN;;
  demoGraphDistrConstant_chartid: String = CHART_CONFIG.demoGraphDistr.CHARTPROPERTIES.CHARTID;
  demoGraphDistrConstant_addClearBtn: boolean = CHART_CONFIG.demoGraphDistr.CHARTPROPERTIES.ADDCLEARBTN;
  demoGraphDistrConstant_legendColors: any = CHART_CONFIG.demoGraphDistr.LEGENDCOLORS;
  demoGraphDistrConstant_options: any;

  attendanceModal: any = {
    openattendanceModal: false,
  };

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  /**
   * Constructor function used to initialse the attendance component
   * @param reportsService
   */
  constructor(
    private attendanceService: AttendanceService,
    public locale: LocaleService,
    public translation: TranslationService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) { }

  /**
   * shows attendance report generating modal
   */
  openAttendanceModal() {
    this.attendanceModal.openattendanceModal = true;
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
    this.updateAttendanceData();
    this.clearSearchButtonFlag = false;
  }

  /**
   * refreshes table data after selecting staff member
   * @param event 
   */
  selectStaff(event) {
    this.clearSearchButtonFlag = true;
    this.selectedPageNo = 1;
    this.updateAttendanceData();
  }

  /**
   * Function to fetch the overview data for attendance
   */
  fetchOverviewData() {
    this.sharedService.getStaffCount(this.selectedLocation)
      .pipe(map((staffCount) => {
        this.staffCount = staffCount;
        if (this.staffCount.data.staffCount) {
          let femaleStaff = this.staffCount.data.staffCount.find((element) => {
            return element.gender == "Female"
          });
          this.femaleStaffCount = femaleStaff ? femaleStaff.count : 0;
        }
        else {
          this.femaleStaffCount = 0;
        }
        if (this.staffCount.data.roleCount) {
          let guards = this.staffCount.data.roleCount.find((element) => {
            return element.role == "guard"
          });
          let supervisors = this.staffCount.data.roleCount.find((element) => {
            return element.role == "supervisor"
          });
          let managers = this.staffCount.data.roleCount.find((element) => {
            return element.role == "manager"
          });
          this.guardCount = guards ? guards.count : 0;
          this.supervisorCount = supervisors ? supervisors.count : 0;
          this.managerCount = managers ? managers.count : 0;
        }
        else {
          this.guardCount = 0;
          this.supervisorCount = 0;
          this.managerCount = 0;
        }
        this.roleWiseDistrData = [
          { "key": "Guards", "y": this.guardCount },
          { "key": "Supervisors", "y": this.supervisorCount },
          { "key": "Managers", "y": this.managerCount }
        ];
        if (this.staffCount.data.securityStateCounts) {
          this.demoGraphDistrData = [];
          this.staffCount.data.securityStateCounts.forEach((element) => {
            let stateCountObj = {
              "key": element.state || '',
              "y": element.count
            };
            this.demoGraphDistrData.push(stateCountObj);
          });
        }
      }),
        catchError(errorData => {
          this.dataError = true;
          return of({ data: {} });
        }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => {
      });
  }

  /**
   * Selects the guard role 
   * @param role 
   * @param evt 
   */
  selectRole(role: string, evt) {
    this.selectedFilterRole = evt.currentTarget.innerText;
    this.selectedRole = role;
    this.selectedPageNo = 1;
    this.updateAttendanceData();
  }

  /**
   * selects date range filter
   * @param evt
   */
  selectDateRange(evt) {
    if (this.dateRange[0] && this.dateRange[1]) {
      this.dateRange[1] = new Date(moment(this.dateRange[1]).add(1, 'day').subtract(1, 'second').format());
      this.selectedPageNo = 1;
      this.updateAttendanceData();
    }
  }

  /**
   * refreshes the table data when state changes
   * @param state
   */
  refresh(state: ClrDatagridStateInterface) {
    this.updateAttendanceData();
  }

  /**
   * Function to fetch the table data for the attendance
   */
  updateAttendanceData() {
    setTimeout(() => { this.tableLoading = true; }, 0);
    let requestBody = {};
    requestBody['startTime'] = this.dateRange[0].getTime();
    requestBody['endTime'] = this.dateRange[1].getTime();
    if (this.selectedRole) {
      requestBody['role'] = this.selectedRole;
    }
    if (this.selectedStaff) {
      requestBody['emailId'] = this.selectedStaff.emailId;
    }
    this.attendanceService.getAttendanceReportData(requestBody, this.selectedLocation, this.selectedPageNo, 5)
      .pipe(map((attendanceData: any) => {
        setTimeout(() => {
          this.attendanceData = attendanceData;
          this.tableLoading = false;
        }, 0);
      }),
        catchError(errorData => {
          this.attendanceData = { data: [] };
          this.tableLoading = false;
          return of({});
        }),
        takeUntil(this.destroyAllSubscriptions))
      .subscribe(res => {
      });
  }

  /**
   * Initialise function for fetching the initial location data
   */
  initLocData() {
    this.route.paramMap
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(paramsMap => {
        this.selectedLocation = paramsMap.get('selectedParam');
        this.fetchOverviewData();
        this.updateAttendanceData();
      })
  }

  /**
   * Init function is used to fetch the data required for attendance tab
   */
  ngOnInit() {
    this.rateWiseDistrConstant_options = CHART_CONFIG.rateWiseDistr.CHARTPROPERTIES;
    this.demoGraphDistrConstant_options = CHART_CONFIG.demoGraphDistr.CHARTPROPERTIES;
    this.demoGraphDistrData = [{ "key": "North Zone", "y": "453" }, { "key": "East Zone", "y": "345" }, { "key": "West Zone", "y": "200" }, { "key": "South Zone", "y": "300" }];

    this.translation.translationChanged()
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(
        (locale) => {
          this.calLocale = CalLocaleSwitch.getLocaleCalendarObj(locale);
          this.allStaffText = this.translation.translate('allStaffText');
          this.femaleStaffText = this.translation.translate('femaleStaffText');
          this.incidentsReportedText = this.translation.translate('incidentsReportedText');
          this.staffOnLeaveText = this.translation.translate('staffOnLeaveText');
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
  }

  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }

}
