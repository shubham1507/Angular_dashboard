import { Pipe, PipeTransform } from '@angular/core';
import { TimeDiff } from 'src/app/lib/time-diff/time-diff';
@Pipe({
  name: 'timeAgoUnit'
})
export class TimeAgoUnitPipe implements PipeTransform {
  /**
   * Takes a createdAt ISO date string value and returns timeAgo.timeUnit from current time.
   */
  transform(createdAt: string) {
    const TRANSLATION_KEY = 'timeUnit';
    if (!createdAt) {
      return '';
    }
    const timeAgo = new TimeDiff(createdAt).getTimeAgo();
    return `${TRANSLATION_KEY}.${timeAgo.timeUnit}`;
  }
}
