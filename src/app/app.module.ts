import { NgModule, APP_INITIALIZER } from "@angular/core";

import { AppComponent } from "./app.component";

import "d3";
import "nvd3";
import { AppRoutingModule } from "./app.routes";
import { PhysicalSecurityModule } from "./physical-security/physical-security.module";
import {
  L10nConfig,
  L10nLoader,
  LocalizationModule,
  StorageStrategy,
  ProviderType
} from "angular-l10n";
import * as firebase from "firebase";
import { environment } from "src/environments/environment";
import { PipesModule } from "./pipes/pipes.module";

/**Configuration constant for the language locales **/
const l10nConfig: L10nConfig = {
  locale: {
    languages: [
      { code: "zh", dir: "ltr" }, //chinese
      { code: "fr", dir: "ltr" }, //french
      { code: "en", dir: "ltr" }, //english
      { code: "de", dir: "ltr" }, //german
      { code: "ja", dir: "ltr" }, //japanese
      { code: "ko", dir: "ltr" }, //korean
      { code: "hi", dir: "ltr" } //hindi
    ],
    defaultLocale: { languageCode: "en", countryCode: "US" },
    storage: StorageStrategy.Session
  },
  translation: {
    providers: [
      { type: ProviderType.Static, prefix: "./assets/i18n/error/error-" }
    ],
    caching: true,
    rollbackOnError: true,
    composedKeySeparator: ".",
    missingValue: "No key in error",
    i18nPlural: true
  }
};

/** Advanced initialization.for the language locales **/
export function initL10n(l10nLoader: L10nLoader): Function {
  return () => l10nLoader.load();
}

/**
 * Root Module for the Application
 * physical security module is the primary dependency module
 */

@NgModule({
  declarations: [AppComponent],
  imports: [
    LocalizationModule.forRoot(l10nConfig),
    PhysicalSecurityModule,
    AppRoutingModule,
    PipesModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initL10n,
      deps: [L10nLoader],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    firebase.initializeApp(environment.FIREBASE_CONFIG);
    const messaging = firebase.messaging();

    if ('serviceWorker' in navigator) {

      navigator.serviceWorker.register('./firebase-messaging-sw.js')
        .then(registration => {

          messaging.useServiceWorker(registration)

        })
        .catch(err => console.log('Problem in initialising the service worker', err))
    }
    else {
      console.error('Push notfications not supported');
    }

  }
}
