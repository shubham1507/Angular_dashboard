import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ErrorsModule } from "src/app/errors/errors.module";
import { ServicesModule } from "src/app/services/services.module";
import { SharedModule } from "src/app/shared/shared.module";
import { SidenavModule } from "../sidenav/sidenav.module";
import { DashboardComponent } from "./dashboard.component";
import { DashBoardRoutes } from "./dashboard-routing";
import { PipesModule } from '../../pipes/pipes.module';

import {
  L10nConfig,
  L10nLoader,
  LocalizationModule,
  ProviderType
} from "angular-l10n";

/**Constant L10 config for the languages , loading the mapping resource translation files */
const l10nConfig: L10nConfig = {
  translation: {
    providers: [
      { type: ProviderType.Static, prefix: "./assets/i18n/shared/shared-" },
      { type: ProviderType.Static, prefix: "./assets/i18n/sidenav/sidenav-" },
      {
        type: ProviderType.Static,
        prefix: "./assets/i18n/dashboard/dashboard-"
      }
    ],
    caching: true,
    rollbackOnError: true,
    composedKeySeparator: ".",
    missingValue: "No key",
    i18nPlural: true
  }
};

/**
 * Dashboard module for the dashboard functionality
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    RouterModule.forChild(DashBoardRoutes),
    LocalizationModule.forChild(l10nConfig),
    CommonModule,
    ServicesModule,
    SharedModule,
    ErrorsModule,
    SidenavModule,
    PipesModule
  ],
  exports: [DashboardComponent]
})
export class DashBoardModule {
  constructor(private l10nLoader: L10nLoader) {
    this.l10nLoader.load();
  }
}
