import { Component, OnInit } from "@angular/core";
import { Router, NavigationError  } from "@angular/router";

/**
 * Application component for bootstrapping the application
 */
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  /**title place holder for the application */
  title = "physical-security";

  constructor(private router : Router){
  }

  ngOnInit(){
    this.router.events.subscribe(
      event => {
        if(event instanceof NavigationError) {
          this.router.navigate(['/authpass']);
        }
      }
    )
  }
}
