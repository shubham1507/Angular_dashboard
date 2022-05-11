import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ServicesModule } from "src/app/services/services.module";
import { SharedModule } from "src/app/shared/shared.module";
import { ErrorsModule } from "src/app/errors/errors.module";
import { RouterModule } from "@angular/router";
import { SidenavModule } from "../sidenav/sidenav.module";
import { LocationDetailsComponent } from "./location-details.component";
import { LocationRoutes } from "./location-details-routing";
import { OverviewComponent } from "./overview/overview.component";
import { StaffComponent } from "./staff/staff.component";
import { ReportsModule } from "./reports/reports.module";
import { PipesModule } from "../../pipes/pipes.module";

import {
  L10nConfig,
  L10nLoader,
  LocalizationModule,
  ProviderType
} from "angular-l10n";

/**
 * L10N languages config for the location languages
 */
const l10nConfig: L10nConfig = {
  translation: {
    providers: [
      { type: ProviderType.Static, prefix: "./assets/i18n/location/location-" },
      { type: ProviderType.Static, prefix: "./assets/i18n/shared/shared-" },
      { type: ProviderType.Static, prefix: "./assets/i18n/sidenav/sidenav-" }
    ],
    caching: true,
    rollbackOnError: true,
    composedKeySeparator: ".",
    missingValue: "No key",
    i18nPlural: true
  }
};

/**
 * Location module for the locations functionality
 */
@NgModule({
  declarations: [
    LocationDetailsComponent,
    OverviewComponent,
    StaffComponent
  ],
  imports: [
    RouterModule.forChild(LocationRoutes),
    CommonModule,
    LocalizationModule.forChild(l10nConfig),
    ServicesModule,
    SharedModule,
    ErrorsModule,
    SidenavModule,
    ReportsModule,
    PipesModule
  ],
  exports: [LocationDetailsComponent]
})
export class LocationDetailsModule {
  constructor(private l10nLoader: L10nLoader) {
    this.l10nLoader.load();
  }
}
