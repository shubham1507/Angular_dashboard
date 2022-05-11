// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    env: "dev",
    BASE_HREF: "/api/physecadmin",
    endpoints: {
        "getLocaleLanguages": "assets/api/languages.json",
        "getIncidents": "assets/api/incidents.json",
        "getIncidentsGlobal": "assets/api/occurenceData.json",
        "getFilteredIncidents": "assets/api/incidents-filtered.json",
        "getIncidentDetails": "assets/api/incident-details.json",
        "getStaffDetails": "assets/api/staffManagementData.json",
        // "getVehicleTrackData": "assets/api/vehicleTrackData.json",
        "getVehicleTrackData": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/vehicle-management/api/v1/reports/vehicle/log/list",
        // "getOccurenceData": "assets/api/occurenceData.json",
        "getOccurenceData": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/occmgmt/api/v1/getOccurrence",
        "getOccurrenceReport": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/occmgmt/api/v1/downloadOccurrenceReport",
        "getOccurrenceCount": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/occmgmt/api/v1/getOccurrenceCount",
        "getCabData": "assets/api/cabData.json",
        "getMaterialData": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/material-management/material/v1/materialLogReport",
        "getMaterialLogCount": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/material-management/material/v2/logCount?startTime={startTime}&endTime={endTime}",
        // "getMaterialReport":"assets/api/material-report.xls",
        "getMaterialReport": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/material-management/material/v1/generateReport",
        "getAttendanceData": "assets/api/attendanceData.json",
        "getNotificationsData": "assets/api/notifications.json",
        "getOfficeLocation": "assets/api/officeLocations.json",
        "getTimelineData": "assets/api/timelinedata.json",
        "getCountriesData": "assets/api/countries.json",
        "getPopularLocations": "assets/api/popularOfficeLocations.json",
        // "getVehicleParkingOverview": "assets/api/vehicle-data.json",
        "getVehicleParkingOverview": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/vehicle-management/api/v1/reports/vehicle/log",
        "getComplianceGlobalData": "assets/api/compliance-global-data.json",
        "getShortageDataGlobal": "assets/api/shortage-global-data.json",
        "getDeploymentData": "assets/api/deployment.json",
        "ssoLogin": "https://mbei.vmware.com:9090/auth-server/oauth/authorize?response_type=code&redirect_uri=https://services.itcna.vmware.com/itcna/apigateway-iot/api/physecadmin/authpass&client_id=PhySecWeb&idp=vidm",
        "getAccessToken": "/auth-server/oauth/token?grant_type=authorization_code&code={authCode}&redirect_uri={redirectUrl}&scope=read",
        "getNewAccessToken": "/auth-server/oauth/token?grant_type=refresh_token&refresh_token={refreshToken}&redirect_uri={redirectUrl}&scope=read",
        "getUserDetails": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/staff-mgmt-service/staffmgmt/v1/getSecPersonnelDetails",
        "peopleSearchUrl": "/people-search/search?entityType=user&q={userEmail}&partnerType=vmware",
        "getImage": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/staff-mgmt-service/staff/v1/getImage/",
        "sendBroadcastNotification": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/staff-mgmt-service/staffmgmt/v1/notification/send",
        "getNotificationForOfcLocation": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/staff-mgmt-service/staffmgmt/v1/notification/getMsg",
        "getLastKnownBriefingReport": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/staff-mgmt-service/staffmgmt/v1/getLastKnownBriefingReport",
        "sendBriefingReport": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/staff-mgmt-service/staffmgmt/v1/addBriefingReport",
        "getShiftDetails": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/staff-mgmt-service/staffmgmt/v1/getShifts",
        "sendUserDeviceInfoForFirebase": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/staff-mgmt-service/staff/v1/notification/user/device",
        "getCabLogOverview": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/vehicle-management/api/v1/reports/cab/log/overview",
        "getCabLog": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/vehicle-management/api/v1/reports/cab/log",
        "getCabLogDownload": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/vehicle-management/api/v1/reports/cab/log/download",
        "getCabServiceTypes": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/vehicle-management/api/v1/cab/service/types",
        "getCabReport": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/vehicle-management/api/v1/reports/cab/log/download",
        "getVehicleTypes": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/vehicle-management/api/v1/vehicle/types",
        "getParkingTypes": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/vehicle-management/api/v1/parking/types",
        "getStaffCount": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/staff-mgmt-service/staffmgmt/v1/securityStaffCount",
        "getAttendanceReport": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/staff-mgmt-service/staffmgmt/v1/getAttendanceReport",
        "searchSecurityPersonnel": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/staff-mgmt-service/staffmgmt/v1/searchSecurityStaff",
        "getstaffCompliance": "https://apigateway-iot-dev.apps.wdc-np.itcna.vmware.com/api/staff-mgmt-service/staffmgmt/v1/getComplianceTask",
        "logoutURL": "https://www.vmware.com"
    },
    "redirectUrl": "https://services.itcna.vmware.com/itcna/apigateway-iot/api/physecadmin/authpass",
    "clientId": "PhySecWeb",
    "clientSecret": "UGh5U2VjV2ViOjczZTQ5Y2I0LWM1MzYtNGU5Ni05M2E1LTY1ZTA4YWIzZTc2MQ==",
    "appId": "SMIE-VMware-693015",
    "tenantId": "SMIE-VMware-6091",
    "loginScreenWait": 5000,
    "appPath": "/api/physecadmin",
    // Chart configurations for the pie charts
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyDogE1lUlmWam0tqLqI5RMkFUYWiuhnHQA",
        authDomain: "physical-security-manager.firebaseapp.com",
        databaseURL: "https://physical-security-manager.firebaseio.com",
        projectId: "physical-security-manager",
        storageBucket: "physical-security-manager.appspot.com",
        messagingSenderId: "495197375055"
    },
    "fireBaseUrl": "https://PUSH-NOTIFICATION/api/v1/push-notification/user/device"

};

  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.
