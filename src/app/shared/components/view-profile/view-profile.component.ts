import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  OnDestroy,
  Inject
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, map } from "rxjs/operators";
import * as moment from "moment";

import {
  Language,
  DefaultLocale,
  TranslationService,
  LocaleService
} from "angular-l10n";
import { SharedService } from "src/app/services/shared.service";
import { DOCUMENT } from "@angular/platform-browser";

/**
 * View Profile component used to view the profile of the selected staff
 */
@Component({
  selector: "physicalsecurity-viewprofile",
  templateUrl: "./view-profile.component.html",
  styleUrls: ["./view-profile.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ViewProfileComponent implements OnInit, OnDestroy {
  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;
  /**
   * Input subject for  popping up the view profile modal
   */
  @Input() openViewProfileSubject: Subject<any>;

  /**
   * Conditional profile flag to show / hide the profile modal
   */
  viewProfileFlag: boolean = false;
  /**
   * Conditional flag to show / hide the language tab
   */
  langActive: boolean = false;

  /**
   * Conditional flag to show / hide the education tab
   */
  eduActive: boolean = false;
  /**
   * Conditional flag to show / hide the document tab
   */
  docActive: boolean = false;

  /**
   * Conditional flag to show / hide the work experience tab
   */
  workExpActive: boolean = false;

  /**
   * Conditional flag to show/ hide the general active tab
   */
  generalActive: boolean = false;

  /**
   * Place holder to store the collection of images
   */
  images: Object[];

  /** Subject to destroy all the subscriptions  */
  destroyAllSubscriptions: Subject<boolean> = new Subject<boolean>();

  profileUserData: Object;

  showLoader: boolean = false;

  langKnownList : Object ;

  educationDetails : Object[];

  age : Number;

  /**
   * Abstract construcor used to initialise the view profile component
   */
  constructor(
    public locale: LocaleService,
    public translation: TranslationService,
    private sharedService: SharedService,
    @Inject(DOCUMENT) private document
  ) {}

  /**
   * Function used to open the view profile modal
   */
  openViewProfileModal(emailid) {
    this.viewProfileFlag = true;
    this.showLoader = true;
    this.getProfileData(emailid);
  }

  getEqualLanguages(languageList) {
    const PART_SIZE = 5;
    let splitLang= {};

    if (languageList.length > 0) {
      splitLang['langOneList'] =  languageList.slice(0, PART_SIZE);
      splitLang['langTwoList'] = languageList.slice(PART_SIZE-1 + 1);
    }

    return splitLang;
  }

  getProfileData(emailid) {
    emailid = "sdongre@vmware.com";
    this.sharedService
      .getLoggedInUserDetails(emailid)
      .pipe(
        map((userData: any) => {
          this.showLoader = false;
          this.profileUserData = this.sharedService.getMappedUserData(userData)['userData'];
          console.log(userData);
          this.langKnownList = this.getEqualLanguages(
              this.profileUserData['langKnownList']
          );
          this.educationDetails = this.profileUserData['educationDetails'];
          this.age = moment().diff(347135400, 'years',false);
        })
        //catchError(errorData => this.handleErrorUserData(errorData))
      )
      .subscribe(data => {});
    console.log(this.document);
  }


  isObjectEmpty = function(checkObj){
    return Object.keys(checkObj).length === 0;
  }
  /**
   * Function to show the user documents
   */
  showDocuments() {
    // TODO : Need to do api call and fetch the documents  data
    this.images = [
      {
        name: "image1",
        href:
          "https://images.pexels.com/photos/236047/pexels-photo-236047.jpeg?cs=srgb&dl=clouds-cloudy-countryside-236047.jpg&fm=jpg"
      },
      {
        name: "image2",
        href:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO_pnrJyykrwe1ayMfgEYJ2uUYv355f_oEQo4QplZWe-_-CZTe"
      },
      {
        name: "image3",
        href:
          "https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg?cs=srgb&dl=bench-carved-stones-cemetery-257360.jpg&fm=jpg"
      },
      {
        name: "image4",
        href:
          "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg"
      },
      {
        name: "image5",
        href:
          "https://images.pexels.com/photos/60006/spring-tree-flowers-meadow-60006.jpeg?cs=srgb&dl=bloom-blossom-flora-60006.jpg&fm=jpg"
      }
    ];
  }

  /**
   * On init function used to subscribe the activity for opening the view profile modal
   */
  ngOnInit() {
    this.openViewProfileSubject
      .pipe(takeUntil(this.destroyAllSubscriptions))
      .subscribe(data => {
        this.openViewProfileModal(data["currentTarget"]["id"]);
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
   * Destroy life cycle hook for the view profile component
   */
  ngOnDestroy() {
    this.destroyAllSubscriptions.next(true);
    this.destroyAllSubscriptions.unsubscribe();
  }
}
