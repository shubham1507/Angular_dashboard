/**
 * model for MaterialReportData
 */
export interface MaterialReportData {
  pageDetails: PageDetails;
  data: MaterialEntry[];
  message: string;
  success: boolean;
}

/**
 * model for pageDetails property in MaterialReportData
 */
interface PageDetails {
  page: number;
  size: number;
  totalPages: number;
  totalCount: number;
}

/**
 * model for MaterialEntry property in MaterialReportData
 */
interface MaterialEntry {
  id: string;
  itemId: string;
  entryTime: number;
  itemName: string;
  itemQuantity: number;
  materialMovementType: string;
  receivedBy: string;
  issueReported: boolean;
}

/**
 * model for MaterialLogCountData
 */
export interface MaterialLogCountData {
  data: CountData;
  message: string;
  success: boolean;
}

/**
 * model for CountData property in MaterialLogCountData
 */
interface CountData {
  countType: string;
  count: number;
  lastUpdatedTime: number;
}
