import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ServicesModule } from "src/app/services/services.module";
import { SharedModule } from "src/app/shared/shared.module";
import { ErrorsModule } from "src/app/errors/errors.module";
import { ReportsComponent } from "./reports.component";
import { OccurrenceComponent } from "./occurrence/occurrence.component";
import { VehicleParkingComponent } from "./vehicle-parking/vehicle-parking.component";
import { CabTrackingComponent } from "./cab-tracking/cab-tracking.component";
import { MaterialComponent } from "./material/material.component";
import { AttendanceComponent } from "./attendance/attendance.component";
import { PipesModule } from "../../../pipes/pipes.module";

import { L10nConfig, LocalizationModule, ProviderType } from "angular-l10n";

/**L10 config constant for the reports module */
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
 * Module for the reports functionality
 */
@NgModule({
  declarations: [
    ReportsComponent,
    OccurrenceComponent,
    VehicleParkingComponent,
    CabTrackingComponent,
    MaterialComponent,
    AttendanceComponent
  ],
  imports: [
    CommonModule,
    LocalizationModule.forChild(l10nConfig),
    ServicesModule,
    SharedModule,
    ErrorsModule,
    PipesModule
  ],
  exports: [ReportsComponent]
})
export class ReportsModule {}
