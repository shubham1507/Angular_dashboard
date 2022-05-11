import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorsHandler } from './errors-handler/errors-handler';
import { ErrorsComponent } from './errors-component/errors-component';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { ToastModule } from 'primeng/toast';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import {
  LocalizationModule,
} from "angular-l10n";



@NgModule({
  declarations: [ErrorsComponent, PageNotFoundComponent],
  imports: [
    CommonModule,
    LocalizationModule,
    RouterModule,
    ToastModule,
    LocalizationModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler,
    }
  ],
  exports: [
    ErrorsComponent
  ]
})
export class ErrorsModule {

}
