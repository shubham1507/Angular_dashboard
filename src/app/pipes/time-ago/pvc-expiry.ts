import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pvcExpiry'
})
export class PvcExpiry implements PipeTransform {
    /**
     * Takes a expiryDate ISO date string value and hasPvc, returns appropriate state of PVC.
     */
    transform(expiryDate: string, hasPvc: boolean, output?: string) {
        if (!hasPvc) {
            return "Pending";
        }
        else {
            let currentDate = new Date().getTime();
            let pvcExpiresAt = Date.parse(expiryDate);
            if (currentDate > pvcExpiresAt) {
                return (output == 'taskType') ? 'Expired' : 'Expired on ';
            }
            else {
                return (output == 'taskType') ? 'Expiring In 30 Days' : 'Expires on ';
            }
        }
    }
}
