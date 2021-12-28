// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  herokuLocationApiUrl: "https://lp-store.herokuapp.com/weather?zipcode=",
  openWeatherApiUrl: "https://api.openweathermap.org/data/2.5/",
  openWeatherId: "5a4b2d457ecbef9eb2a71e480b947604",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
