import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import * as moment from "moment";
import { EventTimelineService } from "../../services/event-timeline.service";
import { Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";

import {
  Language,
  DefaultLocale,
  Timezone,
  DateTimeOptions,
  TranslationService,
  LocaleService
} from "angular-l10n";

/**
 * Event timeline component used to display the time line
 */
@Component({
  selector: "physicalsecurity-event-timeline",
  templateUrl: "./event-timeline.component.html",
  styleUrls: ["./event-timeline.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class EvenTimeLineComponent implements OnInit, OnDestroy {
  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;
  @Timezone() timezone: string;

  options: DateTimeOptions = { month: "short", day: "numeric" };

  today: Date = new Date();

  /**
   * Place holder used to store the timeline data
   */
  timeLineData: any = null;
  /**
   * Place holder used to store the timeline start week
   */
  timeLineStartWeek: Date = moment(
    moment()
      .startOf("week")
      .toDate()
  ).toDate();

  /**
   * Place holder used to store the time line end week
   */
  timeLineEndWeek: Date = moment(
    moment()
      .endOf("week")
      .toDate()
  ).toDate();

  /**
   * Subject used to invoke the add event modal
   */
  openAddEventModalSubject: Subject<any> = new Subject();

  /**
   * Place holder used to store the prevous week start value
   */
  prevWeekStart = null;

  /**
   * Place holder used to hold the previous week end value
   */
  prevWeekEnd = null;

  /**
   * Place holder used to store the next week start value
   */
  nextWeekStart = null;

  /**
   * Place holder used to store the next week end value
   */
  nextWeekEnd = null;

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  /**
   * FUnction used to fetch the prevous week start and the end dates
   */
  getTimeLinePreviousWeek() {
    let currDate = moment(this.timeLineStartWeek, "MMM Do").toDate();
    this.prevWeekStart = moment(
      moment(currDate)
        .subtract(1, "weeks")
        .startOf("week")
    );
    this.prevWeekEnd = moment(
      moment(currDate)
        .subtract(1, "weeks")
        .endOf("week")
    );

    this.timeLineStartWeek = this.prevWeekStart.toDate();
    this.timeLineEndWeek = this.prevWeekEnd.toDate();
  }

  /**
   * Function used to fetch the next week start and the end date
   */
  getTimeLineNextWeek() {
    let currDate = moment(this.timeLineStartWeek, "MMM Do").toDate();
    this.nextWeekStart = moment(
      moment(currDate)
        .add(1, "weeks")
        .startOf("week")
    );
    this.nextWeekEnd = moment(
      moment(currDate)
        .add(1, "weeks")
        .endOf("week")
    );

    this.timeLineStartWeek = this.nextWeekStart.toDate();
    this.timeLineEndWeek = this.nextWeekEnd.toDate();
  }

  /**
   * subject emitter used to open the add event modal popup
   */
  openEventTimeLine() {
    this.openAddEventModalSubject.next();
  }

  /**
   * Constructor function used to initialse the event time line component
   * @param reportsService
   */
  constructor(
    private eventTimelineService: EventTimelineService,
    public translation: TranslationService,
    public locale: LocaleService
  ) { }

  /**
   * Init function used to subscribe to the time line data
   */
  ngOnInit() {
    this.eventTimelineService
      .getTimeLineData()
      .pipe(
        map((timelineData: any) => {
          let timeLineDataMod = [];
          if(timelineData.length > 0) {
            timelineData.forEach(timelIneObj => {
              let timelineModObj = {};
              timelineModObj['activities'] = timelIneObj['activities'];
              timelineModObj['dateVal'] = new Date(timelIneObj['dateVal']);
              timelineModObj['timeActivityEnd'] = new Date(timelIneObj['timeActivityEnd']);
              timelineModObj['timeActivityLocation'] = timelIneObj['timeActivityLocation'];
              timelineModObj['timeActivityStart'] = new Date(timelIneObj['timeActivityStart']);
              timelineModObj['title'] = timelIneObj['title'];
              timeLineDataMod.push(timelineModObj);
            });
          }
          this.timeLineData = timeLineDataMod;
        }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => { });

    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(error => {
        if (error) {
          console.error(error);
        }
      });
  }

  /**
   * Destroy life cycle for the time line component
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
