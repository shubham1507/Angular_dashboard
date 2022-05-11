import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeDiffHrs'
})
export class TimeDiffHrs implements PipeTransform {
    /**
     * Takes a createdAt ISO date string value and returns timeAgo.time from current time.
     */
    transform(startTime: number, endTime: number) {
        if (!startTime) {
            return "-";
        }
        if (!endTime) {
            endTime = new Date().getTime();
        }
        let absDiff = endTime - startTime;
        let timeDiff = Math.floor(absDiff / (1000 * 60 * 60));
        return timeDiff;
    }
}
