import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PhysicalSecurityComponent } from "./physical-security.component";
import { SharedModule } from "../shared/shared.module";
import { ErrorsModule } from "../errors/errors.module";
import { ServicesModule } from "../services/services.module";
import { PhysicalSecurityRoutingModule } from "./physical-security.routes";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { LoginComponent } from "./login/login.component";
import { ClarityModule } from '@clr/angular';

/**
 * Primary module for the Physical security
 * includes shared , errors, services modules as primary dependencies
 * also includes login component to support login functionality
 */
@NgModule({
  declarations: [PhysicalSecurityComponent, LoginComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    PhysicalSecurityRoutingModule,
    ClarityModule
  ],
  exports: [
    PhysicalSecurityComponent,
    LoginComponent,
    ServicesModule,
    SharedModule,
    ErrorsModule
  ]
})
export class PhysicalSecurityModule {}
