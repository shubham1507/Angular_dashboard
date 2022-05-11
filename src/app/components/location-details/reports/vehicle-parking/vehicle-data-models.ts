export interface VehicleReportData {
  pages: number;
  report: VehicleDetails[];
  total: number;
}

interface VehicleDetails {
  qrCodeId: null;
  vehicleNum: string;
  vehicleType: string;
  timeStamp: number;
  ownerEmailId: string;
  ownerContactNumber: number;
  issueReported: string;
  shiftName: string;
  issues: null;
}

export interface VehicleCountData {
  bikesCount: number;
  carpoolParkedCount: number;
  carpoolParkingViolations: number;
  carsCount: number;
  cyclesCount: number;
  electricParkedCount: number;
  electricParkingViolations: number;
  lastUpdatedMaxOccupancyTime: null;
  maxOccupancy: number;
  normalIssues: number;
  otherVehicleCount: number;
  overNightParkingViolations: number;
  totalCount: number;
  vipParkedCount: number;
  vipParkingViolations: number;
}

export interface FilterData {
  data: string[];
  success: boolean;
}
