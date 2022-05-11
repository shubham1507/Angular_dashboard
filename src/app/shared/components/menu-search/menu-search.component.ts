import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { debounceTime, switchMap, distinctUntilChanged } from "rxjs/operators";
import { MenuSearchService } from "../../services/menu-search.service";
import { of, Subscription } from "rxjs";
import { Router } from "@angular/router";

import {
  Language,
  DefaultLocale,
  TranslationService,
  LocaleService
} from "angular-l10n";

/**
 * Menu search component for auto complete search
 */
@Component({
  selector: "physicalsecurity-menusearch",
  templateUrl: "./menu-search.component.html",
  styleUrls: ["./menu-search.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class MenuSearchComponent implements OnInit, OnDestroy {
  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;

  searchtext: string;

  /**
   * Place holder of form control used to store the input search query
   */
  queryField: FormControl = new FormControl();
  /**
   * Place holder to store the results of the search
   */
  results: Array<string>;
  /**
   * Subscription place holder for the search result set
   */
  resSubscr: Subscription;
  /**
   * Condiitional place holder for the focus state of the input search
   */
  showOnFocus: boolean = false;
  /**
   * Conditional place holder to show the loader when the search result fetch is in progress
   */
  showLoader: boolean = false;

  /**
   * Constructor function used to intialise the menu search component
   * @param reportsservice
   * @param router
   */
  constructor(
    private menuSearchService: MenuSearchService,
    private router: Router,
    public locale: LocaleService,
    public translation: TranslationService
  ) { }

  /**
   * Setting the blur  state to out of focus to hide the results
   */
  setBlurState() {
    setTimeout(() => {
      this.showOnFocus = false;
    }, 100);
  }

  /**
   * Navigating to the target route for which the search record is mapped
   * @param evt
   * @param searchres
   */

  goToDetails(evt, searchres) {
    this.menuSearchService.setSharedDTO(searchres);
    this.router.navigate(["/app/location", "Reports"]);
  }

  /**
   * Passing the query to get the matched search record
   * returning the search record observable for matched search
   * and returning the empty observable for no match as
   * switch map not accepts empty string responses
   * @param query
   */
  getData(query) {
    this.showLoader = true;
    if (this.showOnFocus == true && query != "") {
      return this.menuSearchService.search(query);
    }
    if (query == "") {
      return of([]);
    }
  }

  /**
   * Using the on init life cycle to subscribe to the input form control
   * values debouncing for some delay time and removing the duplicate
   * key entries and sending the distinct keys for search and
   * mapping the multiple observables into a flat observable using a switch map
   */
  ngOnInit() {
    this.translation.translationChanged().subscribe(() => {
      this.searchtext = this.translation.translate("menusearch.searchtext");
    });

    this.resSubscr = this.queryField.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(query => this.getData(query))
      )
      .subscribe(result => {
        this.showLoader = false;

        //TODO : As of now mocked the data but need to
        //make sure we always return array of data
        if (!Array.isArray(result)) {
          let singleArrayRes = [];
          singleArrayRes.push(result);
          this.results = singleArrayRes;
        } else {
          this.results = result;
        }
      });
  }

  /**
   * using the on destroy method to unsubscribe the search result subscribtion
   */
  ngOnDestroy() {
    if (this.resSubscr) this.resSubscr.unsubscribe();
  }
}
