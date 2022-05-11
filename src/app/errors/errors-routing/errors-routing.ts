import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";

/**Error constants for the error routes  */
export const ErrorRoutes: Routes = [
  { path: "error", component: PageNotFoundComponent, data: { error: 404 } },
  { path: "**", component: PageNotFoundComponent, data: { error: 404 } }
];

/**Error routing module for the errors */
@NgModule({
  imports: [RouterModule.forChild(ErrorRoutes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule {}
