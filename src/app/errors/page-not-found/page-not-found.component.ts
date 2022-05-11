import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Data } from "@angular/router";

import {
  Language,
  DefaultLocale,
  LocaleService,
  TranslationService
} from "angular-l10n";
/**
 * Page not found component used to handle the page not found functionality
 */
@Component({
  selector: "physicalsecurity-page-not-found",
  templateUrl: "./page-not-found.component.html",
  styleUrls: ["./page-not-found.component.scss"]
})
export class PageNotFoundComponent implements OnInit {
  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;
  /**
   * place holder holds the routed params
   */
  routeParams: Params;

  /**
   * Place holder used to hold the routed data
   */
  data: Data;

  detailedError: string;

  /**
   * Constructor used to instantiate the PageNotFoundComponent
   * @param activatedRoute
   */
  constructor(
    public locale: LocaleService,
    public translation: TranslationService,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * On init function used to read the routed params and data
   */
  ngOnInit() {
    this.routeParams = this.activatedRoute.snapshot.queryParams;
    this.data = this.activatedRoute.snapshot.data;

    if (typeof this.routeParams.error != "undefined") {
      this.detailedError = this.routeParams.error;
    }

    this.translation.translationChanged().subscribe(() => {});
  }
}
