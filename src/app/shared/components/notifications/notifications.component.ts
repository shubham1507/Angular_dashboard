import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  Renderer2
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { notificationsDTO } from "./notifications-model";
import { SharedService } from "src/app/services/shared.service";

import {
  Language,
  DefaultLocale,
  TranslationService,
  LocaleService
} from "angular-l10n";

/**
 * Component used to show the notifications on the header
 */
@Component({
  selector: "physicalsecurity-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;
  clearNotifKey = 'clear_notification_data';

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  /**Used to hold the notifications data from an observable */
  notificationsData: notificationsDTO[] = [];

  /**notification flag to show and hide the notification container */
  shownotifications: boolean = false;

  /** notification subject used to invoke the notification when user select the notification icon */
  @Input() notificationShowSubject: Subject<any>;

  /** notification subject used to invoke the notification when user select the notification icon */
  @Input() notificationDataSubject: Subject<any>;

  /** notif count emitter used to emit the notification count when the user lands  */
  @Output() notifCount = new EventEmitter<any>();

  /**
   * Constructor function used to instantiate the notifications component
   * @param _restApi
   */
  constructor(
    public locale: LocaleService,
    public translation: TranslationService,
    private sharedService: SharedService,
    private renderer: Renderer2
  ) {}

  /**
   * Function does not propagates the event to the parent element and displays the notifications
   * @param evt
   */
  showNotifications(evt) {
    evt.stopPropagation();
    // if (this.notificationsData.length > 0) {
      this.shownotifications = true;
    // }
  }

  /**
   * Function used to hide the notifications
   */
  hideNotifications() {
    this.shownotifications = false;
  }

  /**
   * On initialise function used to subscribe the notifications
   *
   */
  ngOnInit() {
    /**
     * Subscribe to the notification subject and show the notifications when user selects the notification option
     */
    this.notificationShowSubject
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(notifState => {
        this.shownotifications = notifState.open;
        notifState.open ?
          this.renderer.addClass(document.body, 'no-scrolling') :
          this.renderer.removeClass(document.body, 'no-scrolling');
      });

    this.notificationDataSubject
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(notifState => {
        if (
          typeof notifState.notifData != "undefined" &&
          notifState.notifData.length > 0
        ) {
          this.notificationsData = notifState.notifData;
          this.filterOutClearedNotifications();
        } else {
          this.notificationsData = [];
          this.notifCount.emit(0);
        }
      });

    this.translation.translationError
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(error => {
        if (error) {
          console.error(error);
        }
      });
  }

  /**
   * Clear available notifications from notification popup
   */
  clearAllNotifications() {
    let clearNotifData = this.sharedService.getLocalStorageVariable(this.clearNotifKey, true) || {};
    clearNotifData[this.notificationsData[0].building] = new Date();
    this.sharedService.setLocalStorageVariable(this.clearNotifKey, clearNotifData, true);
    this.filterOutClearedNotifications();
  }

  /**
   * Filter out cleared notifications
   */
  filterOutClearedNotifications() {
    if (this.notificationsData && this.notificationsData.length > 0) {
      const clearNotifData = this.sharedService.getLocalStorageVariable(this.clearNotifKey, true) || {};
      const clearDate = new Date(clearNotifData[this.notificationsData[0].building]);
      if (clearNotifData[this.notificationsData[0].building]) {
        this.notificationsData = this.notificationsData.filter(function (notification) {
          return clearDate < new Date(notification.triggeredDate);
        });
      }
    }
    this.notifCount.emit(this.notificationsData.length);
  }

  /**
   *  unsubscribe the  notification subscription data
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
