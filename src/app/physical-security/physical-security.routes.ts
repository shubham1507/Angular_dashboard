import { RouterModule, Routes } from "@angular/router";
import { PhysicalSecurityComponent } from "./physical-security.component";
import { NgModule } from "@angular/core";
import { ErrorRoutes } from "../errors/errors-routing/errors-routing";
import { LoginRouteGuard } from "../guards/login-route-guard";
import { LoginComponent } from "./login/login.component";
import { UserDataResolve } from "../resolvers/userdata.resolve";

/**
 * Constant routes for the physical security module
 */
export const PhysicalSecurityRoutes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "authpass", component: LoginComponent },
  {
    path: "app",
    component: PhysicalSecurityComponent,
    children: [
      { path: "", redirectTo: "error", pathMatch: "full" },
      {
        canActivate: [LoginRouteGuard],
        path: "dashboard",
        loadChildren: "./components/dashboard/dashboard.module#DashBoardModule",
        resolve: {
          resolvedUserData: UserDataResolve
        }
      },
      {
        canActivate: [LoginRouteGuard],
        path: "location/:selectedParam/:selectedTab/:selectedReport",
        loadChildren:
          "./components/location-details/location-details.module#LocationDetailsModule",
        resolve: {
          resolvedUserData: UserDataResolve
        }
      },
      {
        canActivate: [LoginRouteGuard],
        path: "location/:selectedParam/:selectedTab",
        loadChildren:
          "./components/location-details/location-details.module#LocationDetailsModule",
        resolve: {
          resolvedUserData: UserDataResolve
        }
      },
      {
        canActivate: [LoginRouteGuard],
        path: "location/:selectedParam",
        loadChildren:
          "./components/location-details/location-details.module#LocationDetailsModule",
        resolve: {
          resolvedUserData: UserDataResolve
        }
      },
      {
        canActivate: [LoginRouteGuard],
        path: "location",
        loadChildren:
          "./components/location-details/location-details.module#LocationDetailsModule",
        resolve: {
          resolvedUserData: UserDataResolve
        }
      },
      ...ErrorRoutes
    ]
  }
];

/**
 * Login route guard associated to validate the physical routes if
 * user is logged in or not
 */
export const PhysecGuardProviders: any[] = [LoginRouteGuard];

/**
 * Associating the constant physical routes to the router module
 */
@NgModule({
  exports: [RouterModule],
  providers: [
    UserDataResolve
  ]
})
export class PhysicalSecurityRoutingModule { }
