import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { SharedService } from "src/app/services/shared.service";
import { ActivatedRoute } from "@angular/router";

/**
 * Component to display the popular locations in a multiple tables
 */
@Component({
  selector: "physicalsecurity-popular-locations",
  templateUrl: "./popular-locations.component.html",
  styleUrls: ["./popular-locations.component.scss"]
})
export class PopularLocationsComponent implements OnInit {
  /**Used to store the first column locaions */
  firstColCells: string[] = [];

  /**Used to store the second column locations */
  secondColCells: string[] = [];

  /**Used to store the third column locations */
  thirdColCells: string[] = [];

  userEmailId: string;

  popularLocations: string[] = [];
  /**Execute the location click callback for handling the logic on selection of location  */
  @Output() locationClickCallBack = new EventEmitter();

  /**
   * Constructor function used to instantiate the popular locations component
   * @param reportsService
   */
  constructor(private sharedService: SharedService, private route: ActivatedRoute) { }

  /**
   * Invoke the locationcall back on selection of the location
   * @param evt
   */
  locationClick(evt) {
    this.locationClickCallBack.emit(evt);
  }

  /**
   * On initialisation used to fetch the popular locations and store the locations
   * in a tabular format
   */
  ngOnInit() {
    /**
     * Get the popular locations and store in a tabular format
     */
    let mappedUserData = this.route.snapshot.data["resolvedUserData"];
    this.userEmailId = mappedUserData["userData"]['emailId'];

    let recentlySearchedDataString = localStorage.getItem("recentlySearched");
    let recentlySearchedData = recentlySearchedDataString ? JSON.parse(recentlySearchedDataString) : {};

    this.popularLocations = recentlySearchedData[this.userEmailId] || [];

    if (this.popularLocations.length >= 3) {
      this.popularLocations.forEach((item, index) => {
        if (index % 3 == 0) {
          this.firstColCells.push(this.popularLocations[index]);
          this.secondColCells.push(this.popularLocations[index + 1]);
          this.thirdColCells.push(this.popularLocations[index + 2]);
        }
      });
    } else {
      this.firstColCells[0] = this.popularLocations[0];
      if (this.popularLocations[1]) {
        this.secondColCells[0] = this.popularLocations[1];
      }
    }
  }
}
