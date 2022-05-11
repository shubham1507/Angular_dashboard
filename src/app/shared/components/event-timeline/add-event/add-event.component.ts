import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  OnDestroy
} from "@angular/core";
import { Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { SharedService } from "src/app/services/shared.service";

import {
  Language,
  DefaultLocale,
  Timezone,
  TranslationService,
  LocaleService
} from "angular-l10n";
import CalLocaleSwitch from "src/app/shared/utils/cal-locale-switch";

/**
 * Component used to add a event to the event timeline component
 */
@Component({
  selector: "physicalsecurity-add-event",
  templateUrl: "./add-event.component.html",
  styleUrls: ["./add-event.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AddEventComponent implements OnInit, OnDestroy {
  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;
  @Timezone() timezone: string;

  calLocale: Object;
  addEventTitleText: string;
  addNewLocText: string;
  writeHereText: string;

  /**
   * Conditional flag used to open the event modal popup
   */
  eventModallOpen: boolean = false;

  /**
   * Place holder for storing the filtered locations
   */
  filteredLocations: any[];

  /**
   * Place holder to store the locations data
   */
  locationsData: any = {};
  //fromTime : Date;
  //toTime : Date;

  /**
   * subject for opening the add event modal popup
   */
  @Input() openAddEventModalSubject: Subject<any>;

  /**
   * reactive form for the new event holds the propeties like
   * add event title event location desctext from time and to time
   */
  newEventForm = new FormGroup({
    addeventTitle: new FormControl(),
    eventLocation: new FormControl(),
    descText: new FormControl(),
    fromTime: new FormControl(),
    toTime: new FormControl()
  });

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();
  /**
   * Call back function called once the location auto search functionality completes
   * @param event
   */
  filteredLocationComplete(event) {
    let query = event.query;
    this.filteredLocations = this.filterLocation(query, this.locationsData);
  }

  /**
   * Filter location auto search function called for each location query
   * supports the feature of the auto complete suggestion
   * @param query
   * @param locations
   */
  filterLocation(query, locations: any[]): any[] {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    for (let i = 0; i < locations.length; i++) {
      let location = locations[i];
      if (location.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(location);
      }
    }
    return filtered;
  }

  /**
   * On submit handler called to submit the new events form
   */
  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.newEventForm.reset();
  }

  /**
   * Function used to open the event time line popup and set the new event form
   * default values and apply validations to the form properties
   */
  openEventTimeLine() {
    this.newEventForm = this.formBuilder.group({
      addeventTitle: ["", Validators.required],
      fromTime: [new Date(), Validators.required],
      toTime: [new Date(), Validators.required],
      eventLocation: ["", Validators.required],
      descText: ["", Validators.required]
    });
    this.newEventForm.valueChanges
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(val => { });
    this.eventModallOpen = true;
  }

  /**
   * Constructor function used to initialise the add event component
   * @param formBuilder
   */
  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    public translation: TranslationService,
    public locale: LocaleService
  ) { }

  /**
   * On init function to subscribe to the activation of the event modal popup and
   * get the countries data
   */
  ngOnInit() {
    this.openAddEventModalSubject
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(v => {
        this.openEventTimeLine();
      });

    this.sharedService
      .getCountriesData()
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(locationsData => {
        this.locationsData = locationsData.data;
      });

    this.translation
      .translationChanged()
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(locale => {
        this.calLocale = CalLocaleSwitch.getLocaleCalendarObj(locale);
        this.addEventTitleText = this.translation.translate(
          "timeline.addEventTitleText"
        );
        this.addNewLocText = this.translation.translate(
          "timeline.addNewLocText"
        );
        this.writeHereText = this.translation.translate(
          "timeline.writeHereText"
        );
      });

    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(error => {
        if (error) {
          console.error(error);
        }
      });
  }

  /**
   * Destroy life cycle for the add event component
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
