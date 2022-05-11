import { Pipe, PipeTransform } from '@angular/core';
import { TimeDiff } from 'src/app/lib/time-diff/time-diff';

@Pipe({
  name: 'timeAgoNumber'
})
export class TimeAgoNumberPipe implements PipeTransform {
  /**
   * Takes a createdAt ISO date string value and returns timeAgo.time from current time.
   */
  transform(createdAt: string) {
    if (!createdAt) {
      return '';
    }
    const timeAgo = new TimeDiff(createdAt).getTimeAgo();
    return timeAgo.time;
  }
}
