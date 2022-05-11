import { Injectable } from "@angular/core";
import { Router, NavigationError } from "@angular/router";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})

/**
 * Service used to handle the error scenarios and log the error
 * and track the errors
 */
export class ErrorsService {
  /**
   * notification subject used to emit the generated error
   */
  private _notification: Subject<Object> = new Subject();

  /**
   * notification observable used to subscribe the generated errors
   */
  readonly notificationObserv: Observable<
    Object
  > = this._notification.asObservable();

  /**
   * Constructor function used to initialise the Errors Service
   * @param router
   */
  constructor(private router: Router) {
    this.router.events.subscribe((value: any) => {
      if (value instanceof NavigationError) {
        this.router.navigate(["/error"], {
          queryParams: { error: value.error }
        });
      }
    });
  }

  /**
   * Function used to log the generated errors
   * @param error
   */
  logError(error) {
    this._notification.next(error);
  }
}
