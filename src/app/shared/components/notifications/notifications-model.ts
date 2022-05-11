/**
 * MarkUp Interface for the notifications response
 */
export interface notificationsDTO extends Array<any> {
  /**
   * string type data declaration for name
   */
  appName: string;
  /**
   * string type data declaration for details
   */
  notification: Object;
  /**
   * string type data declaration for time
   */
  triggeredDate: Date;
  /**
   * string type data declaration for location
   */
  buildingName: string;
  /**
   * string type data declaration for building name
   */
  building: string;
}
