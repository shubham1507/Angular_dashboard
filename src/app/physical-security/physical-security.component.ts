import { Component, ViewEncapsulation } from "@angular/core";
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError , Event } from "@angular/router";

/**
 * Initialisation entry Point component for the physical security module
 */
@Component({
  selector: "app-physicalsecurity",
  templateUrl: "./physical-security.component.html",
  styleUrls: ["./physical-security.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PhysicalSecurityComponent {
  /**
   * Constructor function used to intitialise the physical security component
   */

  pageLoader : boolean = false;

  constructor(private router : Router) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.pageLoader = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.pageLoader = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
