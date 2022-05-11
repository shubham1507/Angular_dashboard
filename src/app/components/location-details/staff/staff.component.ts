import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { StaffManagementService } from '../../../services/staff-management.service';
import { SharedService } from 'src/app/services/shared.service';
import * as moment from 'moment';
import { Subject, of } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {
  Language,
  DefaultLocale,
  Timezone,
  TranslationService,
  LocaleService,
  DateTimeOptions,
} from 'angular-l10n';
import CalLocaleSwitch from 'src/app/shared/utils/cal-locale-switch';
import { COMPLIANCE_TYPES } from "src/app/shared/const";


@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit, OnDestroy {

  /**
   * Language decorator for translating the language texts
   */
  @Language() lang: string;

  /**
   * Default locale context for the selected locale language
   */
  @DefaultLocale() defaultLocale: string;

  /**
   * Time zone decorator for translating the time zone according to the selected locale
   */
  @Timezone() timezone: string;

  /**
   * Calendar locale for showing the locale calendar for the selectee locale
   */
  calLocale: Object;

  /**
   * Place holder for storing the search text according to the language key
   */
  searchText: string;


  /**
   * Place holder for storing the security guards text according to the language key
   */
  secGuardsText: string;


  /**
   * Place holder for storing the supervisors  text according to the language key
   */
  supervisorsText: string;


  /**
   * Place holder for storing the managers text according to the language key
   */
  ManagersText: string;

  /**
   * Place holder for storing the staff data
   */
  staffData: any;
  /**
   * staff compliance table data
   */
  staffComplianceData: any;
  /**
   * roaster based on week
   */
  roasterWeeklyWise: any;
  /**
   * classification based on compliance
   */
  roasterComplianceWise = COMPLIANCE_TYPES;
  /**
   * classification based on role
   */
  roasterAllStaff: any;
  /**
   * whole staff details table data
   */
  allStaffData: any;

  selectedLocation: string;
  staffCount: any;
  managerCount: number;
  supervisorCount: number;
  guardCount: number;

  selectedComplianceType: string = "All";
  selectedCompliancePageNo: number = 1;
  complianceTableLoading: boolean = false;
  complianceData: any;

  dateOptions: DateTimeOptions = { month: "short", day: "numeric" };

  /**
   * week range selector
   */
  calendarValue: Array<Date> = [moment().startOf('week').toDate(), moment().endOf('week').toDate()];

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();
  /**
   * week selector calendar
   */
  @ViewChild('staffCalendar') calendarInputRef: any;

  /**
   * Subject place holder to view the open view profile modal
   */
  openViewProfileSubject: Subject<any> = new Subject();

  /**
   * Constructor function used to initialse the staff component
   * @param reportsService
   */
  constructor(private staffManagementService: StaffManagementService,
    public sharedService: SharedService,
    public translation: TranslationService,
    public locale: LocaleService,
    private route: ActivatedRoute
  ) { }


  /**
   * Function to get the previous weeks from the current week
   */
  previousWeek() {
    let currDate = moment(this.calendarValue[0], "MM/DD/YYYY");
    let startWeek = moment(moment(currDate).subtract(1, 'weeks').startOf('week')).toDate();
    let endWeek = moment(moment(currDate).subtract(1, 'weeks').endOf('week')).toDate();
    let prevWeekData = [startWeek, endWeek];
    this.calendarValue = prevWeekData;
  }

  /**
   * Function to show the current week
   * @param evt
   */
  showCurrentWeek(evt) {
    let start = new Date(evt);
    start.setDate(start.getDate() - start.getDay());
    this.calendarValue[0] = start;

    let end = new Date(start);
    end.setDate(start.getDate() + 6);
    this.calendarValue[1] = end;

    this.calendarInputRef.overlayVisible = false;

  }

  /**
   * Function to show the next week from the current week
   */
  nextWeek() {
    let currDate = moment(this.calendarValue[0], "MM/DD/YYYY");
    let startWeek = moment(moment(currDate).add(1, 'weeks').startOf('week')).toDate();
    let endWeek = moment(moment(currDate).add(1, 'weeks').endOf('week')).toDate();
    let nextWeekData = [startWeek, endWeek];
    this.calendarValue = nextWeekData;
  }

  /**
   * Function to open the view profile modal
   * @param evt
   */
  openViewProfileModal(evt) {
    this.openViewProfileSubject.next(evt);
  }

  initLocData() {
    this.route.paramMap
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(paramsMap => {
        this.selectedLocation = paramsMap.get('selectedParam');
        this.sharedService.getStaffCount(this.selectedLocation)
          .pipe(map((staffCount: any) => {
            this.staffCount = staffCount || { data: {} };

            if (staffCount.data.roleCount) {
              let manager = staffCount.data.roleCount.find((element) => {
                return element.role == "manager"
              });
              let supervisor = staffCount.data.roleCount.find((element) => {
                return element.role == "supervisor"
              });
              let guard = staffCount.data.roleCount.find((element) => {
                return element.role == "guard"
              });
              this.managerCount = manager ? manager.count : 0;
              this.supervisorCount = supervisor ? supervisor.count : 0;
              this.guardCount = guard ? guard.count : 0;
            }
            else {
              this.managerCount = 0;
              this.supervisorCount = 0;
              this.guardCount = 0;
            }
          }),
            catchError(errorData => {
              return of({ data: {} });
            }),
            takeUntil(this.destroyAllSubscriptions)
          )
          .subscribe(res => { });
        this.getComplianceData();
      })
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


  /**
   * On init life cycle hook for the staff component
   */
  ngOnInit() {
    this.sharedService.getStaffDetails()
      .pipe(map((staffData: any) => {
        this.staffData = staffData.weeklyRoaster;
        this.roasterWeeklyWise = Object.keys(staffData.weeklyRoaster.roasterWeeklyWise);
        this.staffComplianceData = staffData.complianceRoaster;
        // this.roasterComplianceWise = Object.keys(staffData.complianceRoaster.complianceWeeklyWise);
        this.allStaffData = staffData.allStaffRoaster;
        this.roasterAllStaff = Object.keys(staffData.allStaffRoaster.allStaffWeeklyWise);
      }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => { });

    this.translation.translationChanged()
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(
        (locale) => {
          this.calLocale = CalLocaleSwitch.getLocaleCalendarObj(locale);
          this.searchText = this.translation.translate('searchText');
          this.secGuardsText = this.translation.translate('secGuardsText');
          this.supervisorsText = this.translation.translate('supervisorsText');
          this.ManagersText = this.translation.translate('ManagersText');
        });

    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe((error) => {
        if (error) {
          console.error(error);
        }
      });
    this.initLocData();
  }

  /**
   * On destroy life cycle hook for the staff component
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }

}


