import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestApi } from './restapi.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../interceptors/auth-interceptor';
import { AuthService } from './auth.service';
import { SharedService } from './shared.service';
import { AttendanceService } from './attendance.service';
import { CabTrackingService } from './cab-tracking.service';
import { MaterialService } from './material.service';
import { OccurrenceService } from './occurrence.service';
import { VehicleParkingService } from './vehicle-parking.service';
import { DashboardService } from './dashboard.service';
import { StaffManagementService } from './staff-management.service';
import { OverviewService } from './overview.service';
import { PhysecGuardProviders } from '../physical-security/physical-security.routes';


/**
 * Module for the services
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    RestApi,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ...PhysecGuardProviders,
    AuthService,
    SharedService,
    AttendanceService,
    CabTrackingService,
    MaterialService,
    OccurrenceService,
    VehicleParkingService,
    DashboardService,
    OverviewService,
    StaffManagementService
  ]
})
export class ServicesModule { }
