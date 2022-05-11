import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorsService } from "../errors-service/errors-service.service";

/**
 * Global error handler used to handle the errors globally across the application
 */
@Injectable()
export class ErrorsHandler implements ErrorHandler {
  /**
   * Constructor used to initialise the Error handler
   * @param injector
   */
  constructor(private injector: Injector) {}

  /**
   * Generic Error handler method implementation across the application
   */
  handleError(error: Error | HttpErrorResponse) {
    console.error(error);
    const errorService = this.injector.get(ErrorsService);
    errorService.logError(error);
  }
}
