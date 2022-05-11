import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Language,
  DefaultLocale,
  Timezone,
  TranslationService,
  LocaleService
} from 'angular-l10n';
import { takeUntil, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Subject } from 'rxjs';
import * as moment from "moment";

@Component({
  selector: 'shift-details',
  templateUrl: './shift-details.component.html',
  styleUrls: ['./shift-details.component.scss']
})
export class ShiftDetailsComponent implements OnInit, OnDestroy {

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

  currentTime: string;
  clockInterval: any;
  nextShiftTimeCounter: any;
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();
  selectedLocation: string;
  shiftTimings: any[] = [];
  currentShift: string;
  currentShiftEndTime: number;
  nextShiftStartsIn: string;

  constructor(public translation: TranslationService, public locale: LocaleService, public sharedService: SharedService,
    private route: ActivatedRoute) { }

  getCurrentShift() {
    let currentTimeEpoch = new Date().getTime();
    for (let shift of this.shiftTimings) {
      if (shift.shiftName != "SHIFT-G") {
        let shiftStartTime = moment(shift.shiftStartTime, "hh:mm:ss").toDate().getTime();
        let shiftEndTime = moment(shift.shiftEndTime, "hh:mm:ss").add(2, 'minutes').toDate().getTime();
        if (shiftStartTime > shiftEndTime) {
          if (new Date(currentTimeEpoch).getHours() < 12) {
            shiftStartTime = moment(shiftStartTime).subtract(1, 'day').toDate().getTime();
          }
          else {
            shiftEndTime = moment(shiftEndTime).add(1, 'day').toDate().getTime();
          }
        }
        if (shiftStartTime <= currentTimeEpoch && currentTimeEpoch <= shiftEndTime) {
          this.currentShift = shift.shiftName;
          this.currentShiftEndTime = shiftEndTime;
          break;
        }
      }
    }
    this.startNextShiftCountDown();
    this.nextShiftTimeCounter = setInterval(() => {
      this.startNextShiftCountDown();
    }, 10000);
  }

  startNextShiftCountDown() {
    let currentMoment = moment();
    let shiftEndMoment = moment(this.currentShiftEndTime);
    let timePeriodInMinutes = moment.duration(shiftEndMoment.diff(currentMoment)).minutes();
    let timePeriodInHours = moment.duration(shiftEndMoment.diff(currentMoment)).hours();
    
    if (timePeriodInMinutes <= 0 && timePeriodInHours <= 0) {
      clearInterval(this.nextShiftTimeCounter);
      this.getCurrentShift();
    }
    else{
      this.nextShiftStartsIn = (timePeriodInHours ? timePeriodInHours + " Hrs " : "")
      + (timePeriodInMinutes ? timePeriodInMinutes + " Mins" : "");
    }
  }

  initLocData() {
    this.route.paramMap
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(paramsMap => {
        this.selectedLocation = paramsMap.get('selectedParam');
        this.sharedService.getShiftDetails(this.selectedLocation)
          .pipe(
            map((shiftData: any) => {
              console.log(shiftData);
              if (shiftData) {
                this.shiftTimings = shiftData.data.guardShiftTimings;
                this.getCurrentShift();
              }
            }),
            takeUntil(this.destroyAllSubscriptions)
          )
          .subscribe(res => { });
      })
  }

  ngOnInit() {
    this.currentTime = moment().format('dddd DD MMM LT');
    this.clockInterval = setInterval(() => {
      this.currentTime = moment().format('dddd DD MMM LT');
    }, 10000);
    this.initLocData();
  }

  ngOnDestroy() {
    clearInterval(this.clockInterval);
    clearInterval(this.nextShiftTimeCounter);
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }

}
