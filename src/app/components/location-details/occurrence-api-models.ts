export interface MaterialReportData {
    pageDetails: PageDetails;
    data: OccurrenceEntry[];
    success: boolean;
}

interface PageDetails {
    page: number,
    size: number,
    totalPages: number,
    totalCount: number
}

interface OccurrenceEntry {
    id: string,
    appId: string,
    tenantId: string,
    buildingName: string,
    timeZone: string,
    floor: string[],
    shiftInfo: string,
    occurrenceReportedByEmailId: string,
    occurrenceReportedByContactNum: string,
    occurrenceType: string,
    incidentType: string[],
    occurrenceAreaList: string[],
    occurrenceStartedTime: number,
    occurrenceSubmittedTime: number,
    occurrenceStatus: string,
    occurrenceApprovalStatus: string,
    occurrenceDescription: string,
    imagesUrl: string[]
}