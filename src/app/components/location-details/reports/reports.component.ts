import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import {
  Language,
  DefaultLocale,
  LocaleService,
  TranslationService
} from "angular-l10n";

/**Reports components for the reports module */
@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"]
})
export class ReportsComponent implements OnInit, OnDestroy {
  /**Language place holder for translating the texts */
  @Language() lang: string;

  /**Default locale context for the selected locale */
  @DefaultLocale() defaultLocale: string;
  /**
   * boolean value to hide/show occurrence tab
   */
  occurenceActive: boolean = false;
  /**
   * boolean value to hide/show vehicle parking tab
   */
  vehicleTrackActive: boolean = false;
  /**
   * boolean value to hide/show Cab tracking tab
   */
  cabTrackActive: boolean = false;
  /**
   * boolean value to hide/show material tab
   */
  materialActive: boolean = false;
  /**
   * boolean value to hide/show attendance tab
   */
  attendanceActive: boolean = false;

  /**
   * Place holder for storing the selected office location
   */
  selectedOfficeLocation: string;

  /**
   * string to set default selected tab
   */
  selectedTab: string;


  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  constructor(
    public locale: LocaleService,
    public translation: TranslationService,
    private route: ActivatedRoute,
    private location: Location
  ) { }


  setSelectedTab(tab) {
    this.location.go(`/app/location/${escape(this.selectedOfficeLocation)}/reports/${tab}`);
  }

  initLocData() {
    this.route.paramMap
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(paramsMap => {
        this.selectedOfficeLocation = paramsMap.get("selectedParam").trim();
        this.selectedTab = paramsMap.get("selectedReport") || '';

        switch (this.selectedTab) {
          case 'vehicle-parking':
            this.vehicleTrackActive = true;
            break;
          case 'cab-tracking':
            this.cabTrackActive = true;
            break;
          case 'material':
            this.materialActive = true;
            break;
          case 'attendance':
            this.attendanceActive = true;
            break;
          default:
            this.occurenceActive = true;
            break;
        }
      });
  }

  /**
   * On init life cycle for the reports components
   */
  ngOnInit() {
    this.initLocData();
    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(error => {
        if (error) {
          console.error(error);
        }
      });
  }

  /**
   * Destroy life cycle for the reports components
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
