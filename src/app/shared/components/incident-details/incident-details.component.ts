import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy
} from "@angular/core";
import { IncidentService } from "../../services/incident.service";
import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import {
  Language,
  DefaultLocale,
  LocaleService,
  TranslationService,
  DateTimeOptions
} from "angular-l10n";
/**
 * Component used to intitialise the incident details and the
 * Acitivity time line
 */
@Component({
  selector: "physicalsecurity-incident-details",
  templateUrl: "./incident-details.component.html",
  styleUrls: ["./incident-details.component.scss"]
})
export class IncidentDetailsComponent implements OnInit, OnDestroy {
  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;
  /**
   * Conditional flag used to show/hide the incident modal
   */
  @Input() showIncidentModal: boolean = true;
  /**
   * Place holder used to store the incident id
   */
  @Input() IncidentDetails: any;
  /**
   * Output emitter emitted when we initiate the activity for closing the modal
   */
  @Output() closeIncidentModal = new EventEmitter();
  /**
   * Place holder used to store the incident data
   */
  incidentData: any;

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  dateOptions: DateTimeOptions = { weekday:"short", month: "short", day: "numeric" };

  /**
   * Constructor function used to initialise the incident details component
   * @param reportsService
   */
  constructor(
    private incidentService: IncidentService,
    public locale: LocaleService,
    public translation: TranslationService
  ) { }

  /**
   * Function used to close the incident popup
   * and emit the output close event for the parent component
   */
  closeIncidentPopUp() {
    this.showIncidentModal = false;
    this.closeIncidentModal.emit();
  }

  /**
   * on initialise function to get the incident details at the component
   * initialisation
   */
  ngOnInit() {
    // this.incidentService
    //   .getIncidentDetails(this.IncidentId)
    //   .pipe(
    //     map((incidentData: any) => {
    //       this.incidentData = incidentData;
    //     }),
    //     takeUntil(this.destroyAllSubscriptions)
    //   )
    //   .subscribe(res => {});
    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(error => {
        if (error) {
          console.error(error);
        }
      });

    this.incidentData = this.IncidentDetails;
    console.log(this.IncidentDetails,"this.IncidentDetails")
    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(error => {
        if (error) {
          console.error(error);
        }
      });
  }

  /**
   * Destroy life cycle for the incident details components
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
