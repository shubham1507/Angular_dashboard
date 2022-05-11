import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SideNavComponent } from "./sidenav.component";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule } from "@angular/router";

import { LocalizationModule } from "angular-l10n";

/***Module for the side navigation */
@NgModule({
  declarations: [SideNavComponent],
  imports: [CommonModule, LocalizationModule, RouterModule, SharedModule],
  exports: [SideNavComponent]
})
export class SidenavModule {}
