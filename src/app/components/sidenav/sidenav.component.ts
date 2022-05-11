import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnDestroy,
  Input,
  Inject
} from "@angular/core";
import { SharedService } from "../../services/shared.service";
import { Subject, of } from "rxjs";
import { map, takeUntil, catchError } from "rxjs/operators";
import { Router } from '@angular/router';
import { DOCUMENT } from "@angular/common";
import {
  TranslationService,
  Language,
  DefaultLocale,
  Currency,
  LocaleService
} from "angular-l10n";
import { AuthService } from "src/app/services/auth.service";
import { environment } from "src/environments/environment";

/**
 * Side nav cmponent used to hold the side navigation menu items
 */
@Component({
  selector: "physicalsecurity-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SideNavComponent implements OnInit, OnDestroy {
  /**Language decorator to translate the languages */
  @Language() lang: string;
  /**Default locale used to provide the locale context */
  @DefaultLocale() defaultLocale: string;

  @Input() loadedUserData: Object;

  @Input() loadedBuildingData: string[];

  getImageUrl = environment.endpoints.getImage;

  /**Place holder for storing the langauges  */
  languages: Object[];

  /**Place holder for storing the selected language */
  selectedLanguage: Object;

  /**Place holder for storing the search location text */
  searchForOfcLocText: string;

  /**
   * Place holder used to store the collection of countries data
   */
  countriesData: any = {};

  /**
   * Place holder used to store the user data
   */
  userData: any;

  /**
   * Place holder used to store the user image URL
   */
  userImgUrl: string;

  /**
   * Place holder used to hold the country value
   */
  country: any;

  /**
   * Place holder used to store the collection of selected countries
   */
  selectedCountries: string[] = [];

  /**Place holder for storing the building list details */
  buildingList: string[] = [];

  /**
   * Place holder used to store the collection of popular locations
   */
  popularLocations: string[] = [
    "Kalyani Vista, Bangalore",
    "Eco Tower, Pune",
    "304 HillView Avenue, Palo Alto",
    "504 Second Street, San Francisco"
  ];

  /**
   * input template reference for the add location input query search
   */
  @ViewChild("addLocationInput") countryInputRef: ElementRef;

  /**
   * Place holder used to store the collection of filtered countries
   */
  filteredCountries: any[];

  /**
   * Conditional flag used to show / hide the location modal
   */
  locModalFlag: boolean = false;

  /**  Conditional flag to show the log out btns on click of Log out button*/
  logOutBtnsVisible: boolean = false;

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  /**
   * Constructor function used to initialise the side navigation component
   * @param sharedService
   */
  constructor(
    public locale: LocaleService,
    public translation: TranslationService,
    private sharedService: SharedService,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) { }

  /**
   * Function used to open the location modal
   */
  openLocationModal() {
    this.country = "";
    this.locModalFlag = true;
  }

  /** Function to set the default locale for the selected language */
  localeChange(localeSel) {
    this.locale.setDefaultLocale(localeSel.toLowerCase());
  }

  /**
   * Function for assigning the filtered countries for the provided country query search
   * @param event
   */
  filterCountryComplete(event) {
    let query = event.query;
    this.sharedService
      .getCountriesData()
      .pipe(
        map((countriesData: any) => {
          this.filteredCountries = this.filterCountry(
            query,
            countriesData.data
          );
        }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => { });
  }

  /**
   * Function for applying the country filter for the provided query search
   * @param query
   * @param countries
   */
  filterCountry(query, countries: any[]): any[] {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    for (let i = 0; i < countries.length; i++) {
      let country = countries[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    return filtered;
  }

  /**
   * Function to select the country from the popular location search
   * @param evt
   */
  selectPopularLocation(evt) {
    if (this.selectedCountries.indexOf(evt.currentTarget.innerText) == -1) {
      this.selectedCountries.push(evt.currentTarget.innerText);
    }
    this.locModalFlag = false;
  }

  /**
   * Function to select the country from the auto suggestions
   * @param value
   */
  onLocationSelect(value) {
    if (this.selectedCountries.indexOf(value.name) == -1) {
      this.selectedCountries.push(value.name);
    }

    setTimeout(() => {
      this.countryInputRef["el"].nativeElement
        .querySelector(".ui-autocomplete-input")
        .blur();
      this.locModalFlag = false;
    }, 200);
  }

  handleErrorUserData(errorData) {
    return of({});
  }

  showLogOutBtns(evt) {
    evt.stopPropagation();
    this.logOutBtnsVisible = true;
  }

  hideLogOutBtns() {
    this.logOutBtnsVisible = false;
  }

  logOut() {
    AuthService.clearLocalStorage();
    this.document.location.href = environment.endpoints.logoutURL;
  }
  /**
   * On initialise function to navigate to the authpass and
   * perform data retrieval for user data from people finder
   */
  ngOnInit() {
    this.buildingList = this.loadedBuildingData;
    this.userData = this.loadedUserData;
    this.sharedService.getPeopleSearchData(this.userData.emailId)
      .pipe(
        map((peopleSearchData: any) => {
          this.userImgUrl = peopleSearchData.userResource.users[0].fullImage;
        }),
        takeUntil(this.destroyAllSubscriptions)
      )
      .subscribe(res => { });

    this.sharedService
      .getLocaleLanguages()
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(languages => {
        this.languages = languages.locales;
      });

    this.translation
      .translationChanged()
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(() => {
        this.searchForOfcLocText = this.translation.translate(
          "searchForOfcLocText"
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
   * Destroy life cycle hook for the side nav component
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
