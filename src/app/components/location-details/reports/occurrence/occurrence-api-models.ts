export interface OccurrenceListResponse {
    data: OccurrenceData[],
    success: boolean,
    pageDetails: PageDetails
}

interface OccurrenceData {
    appId: string,
    buildingName: string,
    floor: string[],
    floorWing: string,
    id: string,
    imagesUrl: string[],
    incidentType: string[],
    occurrenceApprovalStatus: string,
    occurrenceAreaList: string[],
    occurrenceDescription: string,
    occurrenceFloorList: string[],
    occurrenceReportedByContactNum: string,
    occurrenceReportedByEmailId: string,
    occurrenceStartedTime: number,
    occurrenceStatus: string,
    occurrenceSubmittedTime: number,
    occurrenceSubmittedToEmailId: string,
    occurrenceType: string,
    otherIncidentType: string,
    shiftInfo: string,
    tenantId: string,
    timeZone: string,
    updateInfo: any[]
}

interface PageDetails {
    page: number,
    size: number,
    totalCount: number,
    totalPages: number
}