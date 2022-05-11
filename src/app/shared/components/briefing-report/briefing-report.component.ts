import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  ViewEncapsulation,
  OnDestroy
} from "@angular/core";
import { Subject, Observable, of } from "rxjs";
import { TOOLBAR_CONFIG } from "../../const";

import {
  Language,
  DefaultLocale,
  LocaleService,
  TranslationService
} from "angular-l10n";
import { SharedService } from "../../../services/shared.service";
import { RestApi } from "src/app/services/restapi.service";
import { environment } from "src/environments/environment";
import { map, catchError, takeUntil } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
/**
 * Briefing component for adding the briefing modal changes
 * Also includes the location selection and editing the briefing content
 * for the selected location
 */
@Component({
  selector: "physicalsecurity-briefing-report",
  templateUrl: "./briefing-report.component.html",
  styleUrls: ["./briefing-report.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BriefingReportComponent implements OnInit, OnDestroy {
  /**Language decorator used to translate the texts */
  @Language() lang: string;

  /**Default locale used to provide the context for the locale  */
  @DefaultLocale() defaultLocale: string;

  /**Place holder key used for storing the type content here text */
  typeContentHereText: string;

  /**Place holder key used for storing the search for office location text */
  searchForOfcLocText: string;

  /**Place holder for capturing the error message for the briefing report */
  locationErrorMsg: string;

  /**Conditional flag used to show the error alert modal */
  showErrorAlert: boolean = false;

  /**Conditional flag used to show the success alert modal */
  showSuccessAlert: boolean = false;

  enableHTMLEditor = true;

  /**
   * location input template reference for removing the focus once user performs close operation
   *  */
  @ViewChild("addOfficeLocationInput") OfficelocationInputRef: ElementRef;

  /**
   * briefing modal subject used to create an association between  the wrapper component for opening the briefing modal pop up
   */
  @Input() openBriefingModalSubject: Subject<any>;

  @Input() loadedUserData: Object;

  @Input() loadedBuildingData: string[];

  /**
   * Place holder for storing the countries data
   */
  OfficeLocationsData: Array<Object> = [{}];

  /**
   * place holder for storing the officeLocation details
   */
  officeLocation: Object;

  /**
   * place holder for holding the first column section of countries for the popular locations
   */
  firstColCount: string[] = [];

  /**
   *  place holder for holding the second column section of countries for the popular locations
   */
  secondColCount: string[] = [];

  /**
   *  place holder for holding the thirdcolumn section of countries for the popular locations
   */
  thirdColCount: string[] = [];

  /**
   * Place holder for storing the filtered countries when we are doing an auto complete operation
   */
  filteredOfficeLocations: any[];

  /**
   * Conditional flag used to open and close the briefing modal
   */
  locModalFlag: boolean = false;

  /**
   * Conditional flag used to store the editing value for the toolbar editor
   */
  breifingEditVal: string = " ";

  /**
   * Conditional flag used to navigate back to the autoComplete location search
   */
  backToLocSelection: boolean = false;

  /**
   * place holder for storing the quill editor instance
   */
  quillEditInst = null;

  /**
   * Conditional flag used to show the edit section based on the flag value
   */
  edited = true;

  /**
   * Conditional flag used to show the read only state for the editor toolbar
   */
  isReadOnly = true;

  /**
   * place holder for storing the options for the editor toolbar
   */
  options = {
    toolbar: TOOLBAR_CONFIG
  };

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  /** Place holder used to store the logged in user data */
  userData: Object = {};

  /** Conditional flag used to show the spinner icon */
  showSpinner: boolean = false;

  /**Pasted Html contains the html pasted for quill editor */

  pastedHTML: string;

  /**Place holder to display if no locations present */
  emptyMessage: string;

  lastUpdated: number;

  recentlySearchedData: any = {};
  recentlySearchedLocations: string[] = [];

  /**
   * Constructor function used to initialise the briefing component modal
   * @param reportsService
   */
  constructor(
    private _restApi: RestApi,
    private sharedService: SharedService,
    public locale: LocaleService,
    public translation: TranslationService
  ) { }

  /**
   * Function used to open the briefing modal along by resetting the modal data
   */
  openBriefingModal() {
    this.resetModal();
    this.locModalFlag = true;
    this.OfficelocationInputRef['overlayVisible'] = false;
  }

  /**
   * Function called after when the user performs the auto complete search
   * @param event
   */
  filteredOfficeLocationComplete(event) {
    let query = event.query;
    this.filteredOfficeLocations = this.filterOfficeLocation(
      query,
      this.OfficeLocationsData
    );
  }

  /**
   * Function handles the auto complete search operation and returns the list of countries
   * filtered based on the provided query search
   * @param query
   * @param countries
   */
  filterOfficeLocation(pr_query, officeLocations: any[]): any[] {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    officeLocations.forEach((item, officeLocation) => {
      if (item["name"].toLowerCase().indexOf(pr_query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    });
    return filtered;
  }

  /**
   * Function used to populate the selected location
   */
  populateSelectLocation(evt) {
    this.backToLocSelection = true;
    this.officeLocation = { name: evt.currentTarget.innerText, code: evt.currentTarget.innerText };
    this.updateinRecentlySearched(evt.currentTarget.innerText);
    this.populateLocationEditValue(evt.currentTarget.innerText);
  }

  /**
   * Function used to initialise the html editor
   */
  initHTMLEditor() {
    this.enableHTMLEditor = false;
    this.pastedHTML = this.breifingEditVal;
  }

  /**
   * Function used to set the reset state for the briefing modal
   */
  resetModal() {
    this.backToLocSelection = false;
    this.officeLocation = {};
    this.breifingEditVal = "";
    this.showErrorAlert = false;
    this.showSuccessAlert = false;
    this.showSpinner = false;
    this.pastedHTML = "";
    this.enableHTMLEditor = true;
    this.lastUpdated = 0;
  }

  /**
   * Function used to set the navigation back to the auto search from the recent searches location search
   * @param value
   */
  onOfficeLocationSelect(value) {
    this.updateinRecentlySearched(value.code);
    this.backToLocSelection = true;
    this.populateLocationEditValue(value.code);
  }

  updateinRecentlySearched(location: string) {
    let indexInRecent = this.recentlySearchedLocations.indexOf(location);

    if (indexInRecent >= 0) {
      this.recentlySearchedLocations.splice(indexInRecent, 1);
    }
    this.recentlySearchedLocations.unshift(location);

    this.recentlySearchedData[this.loadedUserData['emailId']] = this.recentlySearchedLocations;
    localStorage.setItem('recentlySearched', JSON.stringify(this.recentlySearchedData));
  }

  /**Function used to pass the html to the quill editor */
  passHTMLToEditor(event) {
    this.quillEditInst.pasteHTML(this.pastedHTML);
    this.breifingEditVal = this.quillEditInst.root.innerHTML;
    this.pastedHTML = this.breifingEditVal;
    this.enableHTMLEditor = true;
  }

  /**
   * Function used to send the briefing report for the edited location data
   */
  sendEditedLocationData() {
    let sendReportUrl = environment.endpoints.sendBriefingReport;

    //Assigning the headers data
    let optionsData = {
      "X-BuildingName":
        typeof this.officeLocation["code"] == "undefined"
          ? ""
          : this.officeLocation["code"]
    };
    let options = { headers: optionsData };

    //Assigning the body data
    let reportData = {};
    reportData["buildingName"] = this.officeLocation["code"];
    reportData["briefingReportText"] = this.breifingEditVal;
    reportData["timeZone"] = AuthService.getTimeZone();
    reportData["timeAdded"] = new Date().getTime();

    this.showSpinner = true;

    this._restApi
      .makeApiCall("post", sendReportUrl, reportData, options)
      .pipe(
        map(successData => this.handleSendReportDataSuccess(successData)), //this will return the response when success
        catchError(errorData => this.handleSendReportDataError(errorData)),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(val => { });
  }

  /**
   * Function used to handle the success scenario once the edited data is posted for selected location
   * @param successData
   */
  handleSendReportDataSuccess(successData) {
    this.lastUpdated = new Date().getTime();
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 4000);
    this.showErrorAlert = false;
    this.showSpinner = false;
  }

  /**
   * Function used to handle the error scenario once the edited data is posted for selected location
   * @param errorData
   */
  handleSendReportDataError(errorData): Observable<Object> {
    this.showSuccessAlert = false;
    this.setErrorMsg(errorData);
    this.showSpinner = false;
    return of({});
  }

  /**
   * Populate the briefing report text for the selected location value
   * @param officeLocationValue
   */
  populateLocationEditValue(officeLocationValue) {
    let editDataUrl = environment.endpoints.getLastKnownBriefingReport;
    officeLocationValue =
      typeof officeLocationValue == "undefined" ? "" : officeLocationValue;
    //Assigning the headers data
    let optionsData = { "X-BuildingName": officeLocationValue };
    let options = { headers: optionsData };

    this._restApi
      .makeApiCall("get", editDataUrl, {}, options)
      .pipe(
        map(successData => this.handlePopulatedLocationData(successData)), //this will return the response when success
        catchError(errorData =>
          this.handlePopulateLocationDataError(errorData)
        ),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(val => { });
  }

  /**
   * Function used to handle the success response for the prefetch brieifing report for selected location
   */
  handlePopulatedLocationData(editedData) {
    this.breifingEditVal = editedData["data"]["briefingReportText"];
    this.lastUpdated = editedData["data"]["timeAdded"];
    this.pastedHTML = this.breifingEditVal;
  }

  /**
   * Function used to handle the error response for the predfetch briefing report for the selected location
   */
  handlePopulateLocationDataError(errorData): Observable<Object> {
    this.showSuccessAlert = false;
    this.setErrorMsg(errorData);
    return of({});
  }

  /**
   * Set the generated error msg
   * @param errorData
   */
  setErrorMsg(errorData) {
    this.locationErrorMsg = errorData["error"]["message"];
    this.showErrorAlert = true;
  }

  /**
   * Function used to instantiate the quill editor passed to the callback of the onEditor created
   * @param quillInstance
   */
  editorInstance(quillInstance) {
    this.quillEditInst = quillInstance;
    this.quillEditInst.theme.modules.toolbar.container.hidden = true;
    this.edited = true;
  }

  /**
   * Function used to show the editor toolbar
   */
  showEditorToolBar = function () {
    this.quillEditInst.theme.modules.toolbar.container.hidden = false;
    this.edited = false;
    this.isReadOnly = false;
  };

  /**
   * Function used to hide the editor toolbar
   */
  hideEditorToolBar = function () {
    this.quillEditInst.theme.modules.toolbar.container.hidden = true;
    this.edited = true;
    this.isReadOnly = true;
    if (
      typeof this.breifingEditVal != "undefined" &&
      this.breifingEditVal.length > 0
    ) {
      this.sendEditedLocationData();
    }
  };

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
   * Subscription handler for opening the briefing modal subject
   */

  ngOnInit() {
    this.translation.translationChanged().subscribe(() => {
      this.searchForOfcLocText = this.translation.translate(
        "briefing.searchForOfcLocText"
      );
      this.typeContentHereText = this.translation.translate(
        "briefing.typeContentHereText"
      );
      this.emptyMessage = this.translation.translate("locationNotFound");
    });

    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(error => {
        if (error) {
          console.error(error);
        }
      });
    let recentlySearchedDataString = localStorage.getItem("recentlySearched");
    this.recentlySearchedData = recentlySearchedDataString ? JSON.parse(recentlySearchedDataString) : {};

    this.recentlySearchedLocations = this.recentlySearchedData[this.loadedUserData['emailId']] || [];

    this.OfficeLocationsData = this.mapToAutoCompleteData(
      this.loadedBuildingData
    );
    this.userData = this.loadedUserData;
    this.lastUpdated = 0;

    this.openBriefingModalSubject
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(data => {
        this.openBriefingModal();
      });
  }

  /**
   * Destroy life cycle hook for briefing component
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
