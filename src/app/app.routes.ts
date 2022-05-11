import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ErrorRoutes } from "./errors/errors-routing/errors-routing";
import { PhysicalSecurityRoutes } from "./physical-security/physical-security.routes";

/**Constant routes for the Application */
const routes: Routes = [
  { path: "", redirectTo: "/authpass", pathMatch: "full" },
  ...PhysicalSecurityRoutes,
  ...ErrorRoutes,
];

/**
 * Route Module configuration at the app level
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
