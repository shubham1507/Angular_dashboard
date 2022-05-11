import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Subject, Observable, of, forkJoin } from "rxjs";

import {
  Language,
  DefaultLocale,
  TranslationService,
  LocaleService
} from "angular-l10n";

import { RestApi } from "src/app/services/restapi.service";
import { environment } from "src/environments/environment";
import { catchError, map, takeUntil } from "rxjs/operators";

/**
 * Broadcast component used to broadcast the message for the provided office location
 */
@Component({
  selector: "physicalsecurity-broadcast-location",
  templateUrl: "./broadcast-location.component.html",
  styleUrls: ["./broadcast-location.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BroadCastLocationComponent implements OnInit, OnDestroy {
  /** language decorator used for translating texts */
  @Language() lang: string;

  /** locale context for locating the default locale */
  @DefaultLocale() defaultLocale: string;

  @Input() loadedUserData: Object;

  @Input() loadedBuildingData: string[];

  /** Conditional flag used to show the success alert on submit operation */
  showSuccessAlert: boolean = false;

  /**Conditional flag to show the spinner for the submit operation */
  showLoadSpinner: boolean = false;

  /** Conditional flag used to show the error alert on submit operation */
  showErrorAlert: boolean = false;

  /** Place holder used to store the logged in user data */
  userData: Object = {};

  /** Place holder used to store the translated auto complete text  */
  autocompletetext: string;

  /** Place holder used to store the translated write here text */
  writeheretext: string;

  /** Place holder used to store the translated add here text */
  addtitletext: string;

  /**Place holder to display if no locations present */
  emptyMessage: string;

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  /**
   * Conditional flag used to open and close the broadcast modal
   */
  locBroadCastFlag: boolean = false;

  /**
   * Place holder used to store the filtered office locations
   */
  filteredOfcLocations: any[];

  /**
   *Place holder used to store the office location data
   */
  OfclocationData: any = {};

  /**
   * Subject for updating the state for activating the broadcast modal
   */
  @Input() openBroadcastModalSubject: Subject<any>;

  /**
   * Reactive broadcast form for capturing the office locaion and the description text
   */
  broadCastForm = new FormGroup({
    officeLocation: new FormControl(),
    broadcastTitle: new FormControl(),
    descText: new FormControl()
  });

  @ViewChild("addOfficeLocationInput") OfficelocationInputRef: ElementRef;

  /**
   * Function acts as complete call back when the auto search completes for the office location input
   * @param event
   */
  filterOfcLocationComplete(event) {
    let query = event.query;
    this.filteredOfcLocations = this.filterOfcLocation(
      query,
      this.OfclocationData
    );
  }

  /**
   * Auto complete function used to filter the office location based on the query provided
   * @param query
   * @param locations
   */
  filterOfcLocation(pr_query, pr_ofclocations: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < pr_ofclocations.length; i++) {
      let ofclocation = pr_ofclocations[i];
      if (ofclocation.name.toLowerCase().indexOf(pr_query.toLowerCase()) == 0) {
        filtered.push(ofclocation);
      }
    }
    return filtered;
  }

  /**
   * On submit function when user is ready to submit the broadcasr form data
   */
  onSubmit() {
    let url = environment.endpoints.sendBroadcastNotification;
    let broadcastSubList: any[] = [];
    this.showLoadSpinner = true;

    this.broadCastForm.value["officeLocation"].forEach((officeLoc, index) => {

      let optionsData = {
        "X-BuildingName":
          typeof officeLoc["code"] == "undefined"
            ? ""
            : officeLoc["code"]
      };
      let options = { headers: optionsData };

      let postdata = {};
      postdata["appName"] = this.userData["role"];
      postdata["userEmail"] = this.userData["emailId"];
      postdata["notification"] = {
        title: this.broadCastForm.value["broadcastTitle"],
        body: this.broadCastForm.value["descText"]
      };
      postdata["building"] = officeLoc["code"];
      postdata["sendToAll"] = true;
      console.log(postdata)

      broadcastSubList[index] = this._restApi.makeApiCall("post", url, postdata, options)
    });

    forkJoin(broadcastSubList)
      .pipe(
        map(successData => this.handleBroadCastSuccess(successData)),
        catchError(errorData => this.handleBroadCastError(errorData)),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(val => { });
    this.broadCastForm.reset();
  }

  /**
   * Error callback function used to handle the error response data
   * @param errorData
   */
  handleBroadCastError(errorData): Observable<Object> {
    this.showErrorAlert = true;
    this.showLoadSpinner = false;
    this.showSuccessAlert = false;
    return of({}); // returning the empty observable as a fallback after handling the error response locally
  }

  /**
   * Success call back function used to handle the success response data
   * @param successData
   */
  handleBroadCastSuccess(successData) {
    this.showErrorAlert = false;
    this.showLoadSpinner = false;
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 4000);
  }

  /**
   * Mapping function to convert the provided office locations
   * to the auto suggested search data format
   * @param officeLocations
   */
  mapToAutoCompleteData(officeLocations: String[]) {
    let mappedOfficeLocations = [];
    for (let indx = 0; indx < officeLocations.length; indx++) {
      let readOfcLocationObj = {};
      readOfcLocationObj["name"] = officeLocations[indx];
      readOfcLocationObj["code"] = officeLocations[indx];
      mappedOfficeLocations.push(readOfcLocationObj);
    }
    return mappedOfficeLocations;
  }

  /**
   * Function used to open the broadcast modal
   * set the initial broadcast form values and add default validations
   * subscribe to the value changes for the form properties and open the modal
   */
  openBroadCastModal() {
    this.broadCastForm = this.formBuilder.group({
      officeLocation: [[], Validators.required],
      descText: ["", [Validators.required, this.noWhitespaceValidator]],
      broadcastTitle: ["", [Validators.required, this.noWhitespaceValidator]]
    });
    this.broadCastForm.valueChanges
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(val => { });
    this.locBroadCastFlag = true;
    this.showErrorAlert = false;
    this.showSuccessAlert = false;
    this.OfficelocationInputRef['overlayVisible'] = false;
  }

  /**
   * White space validator function to validate empty spaces
   * @param control
   */
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  /**
   * Constructor used to initalise the broadcast modal
   * @param formBuilder
   */
  constructor(
    private _restApi: RestApi,
    private formBuilder: FormBuilder,
    public translation: TranslationService,
    public locale: LocaleService
  ) { }

  /**
   * Initialise life cycle hook used to
   * subscribe to component subscriptions
   */
  ngOnInit() {
    this.openBroadcastModalSubject
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(modDt => {
        this.openBroadCastModal();
      });



    this.OfclocationData = this.mapToAutoCompleteData(this.loadedBuildingData);
    this.userData = this.loadedUserData;

    this.translation
      .translationChanged()
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(() => {
        this.autocompletetext = this.translation.translate(
          "broadcast.autocompletetext"
        );
        this.writeheretext = this.translation.translate("broadcast.writehere");
        this.addtitletext = this.translation.translate("broadcast.addTitle");
        this.emptyMessage = this.translation.translate("locationNotFound");
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
   * Destroy life cycle hook used to unsubscribe all data subscriptions
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
