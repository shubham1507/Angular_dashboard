import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from "@angular/core";
import { ErrorsService } from "../errors-service/errors-service.service";
import { MessageService } from "primeng/api";
import { ViewRef_ } from "@angular/core/src/view";

/**
 * Error component used to subscribe the generated errors
 */
@Component({
  selector: "physicalsecurity-errorscomponent",
  templateUrl: "./errors-component.html",
  styleUrls: ["./errors-component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorsComponent implements OnInit {
  /**
   * Place holder to store the generated errors data
   */
  public notifData: Array<any> = [];

  /**
   * Constructor function used to initialise the Errors Component
   * @param errorSvc
   * @param changedetectRef
   * @param messageService
   */
  constructor(
    private errorSvc: ErrorsService,
    private changedetectRef: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  /**
   * On init function used to subscribe the generated errors and
   * show the errors as toast messages
   */
  ngOnInit() {
    this.errorSvc.notificationObserv.subscribe(notifObj => {
      if (notifObj) {
        this.notifData = [];
        /**
         * Toast notification object used to generate the toast notification
         */
        let toastObject = {
          severity: "error",
          summary: "Error",
          detail: notifObj["message"]
        };
        this.notifData.push(toastObject);
        this.messageService.addAll(this.notifData);
        if (
          this.changedetectRef !== null &&
          this.changedetectRef !== undefined &&
          !(this.changedetectRef as ViewRef_).destroyed
        ) {
          this.changedetectRef.detectChanges();
        }
      }
    });
  }
}
