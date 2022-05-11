import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IncidentDetailsComponent } from "./components/incident-details/incident-details.component";
import { PopularLocationsComponent } from "./components/popular-locations/popular-locations.component";
import { BriefingReportComponent } from "./components/briefing-report/briefing-report.component";
import { NotificationsComponent } from "./components/notifications/notifications.component";
import { BroadCastLocationComponent } from "./components/broadcast-location/broadcast-location.component";
import { ClarityModule } from "@clr/angular";
import { NvD3Module } from "ng2-nvd3";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { AutoCompleteModule } from "primeng/autocomplete";
import { HttpClientModule } from "@angular/common/http";
import { QuillModule } from "ngx-quill";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CarouselModule } from "primeng/carousel";
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { ToastModule } from "primeng/toast";
import { RouterModule } from "@angular/router";
import { MultiSelectModule } from "primeng/multiselect";
import { CustomChartComponent } from "./components/custom-chart/custom-chart.component";
import { EvenTimeLineComponent } from "./components/event-timeline/event-timeline.component";
import { AddEventComponent } from "./components/event-timeline/add-event/add-event.component";
import { FireBaseNotificationComponent } from "./components/firebase-notification/firebase-notification.component";
import { MenuSearchComponent } from "./components/menu-search/menu-search.component";
import { ViewProfileComponent } from "./components/view-profile/view-profile.component";
import { ShiftDetailsComponent } from "./components/shift-details/shift-details.component";
import { SharedService } from "../services/shared.service";
import { IncidentService } from './services/incident.service';
import { EventTimelineService } from './services/event-timeline.service';
import { MenuSearchService } from './services/menu-search.service';

import { LocalizationModule } from "angular-l10n";
import { PipesModule } from "../pipes/pipes.module";

/**
 * Shared module holds all the components and utils required for the physical security Module
 */
@NgModule({
  declarations: [
    CustomChartComponent,
    IncidentDetailsComponent,
    PopularLocationsComponent,
    BriefingReportComponent,
    NotificationsComponent,
    BroadCastLocationComponent,
    AddEventComponent,
    EvenTimeLineComponent,
    MenuSearchComponent,
    ViewProfileComponent,
    FireBaseNotificationComponent,
    ShiftDetailsComponent
  ],
  imports: [
    CommonModule,
    LocalizationModule, // New instance of TranslationService.
    ClarityModule,
    RouterModule,
    NvD3Module,
    FormsModule,
    CalendarModule,
    AutoCompleteModule,
    HttpClientModule,
    QuillModule,
    ReactiveFormsModule,
    InputTextareaModule,
    CarouselModule,
    AngularFireModule.initializeApp(environment.FIREBASE_CONFIG),
    AngularFireMessagingModule,
    ToastModule,
    MultiSelectModule,
    PipesModule
  ],
  exports: [
    CustomChartComponent,
    IncidentDetailsComponent,
    PopularLocationsComponent,
    BriefingReportComponent,
    NotificationsComponent,
    BroadCastLocationComponent,
    AddEventComponent,
    EvenTimeLineComponent,
    MenuSearchComponent,
    ViewProfileComponent,
    FireBaseNotificationComponent,
    ShiftDetailsComponent,
    ClarityModule,
    NvD3Module,
    FormsModule,
    CalendarModule,
    AutoCompleteModule,
    HttpClientModule,
    QuillModule,
    ReactiveFormsModule,
    InputTextareaModule,
    CarouselModule,
    ToastModule,
    MultiSelectModule
  ],
  providers: [
    SharedService,
    EventTimelineService,
    IncidentService,
    MenuSearchService
  ]
})
export class SharedModule { }
