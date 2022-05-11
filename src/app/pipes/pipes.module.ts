import { NgModule } from '@angular/core';
import { TimeAgoNumberPipe } from './time-ago/time-ago-number';
import { TimeAgoUnitPipe } from './time-ago/time-ago-unit';
import { TimeDiffHrs } from './time-ago/time-diff-hrs';
import { PvcExpiry } from './time-ago/pvc-expiry';

@NgModule({
  declarations: [
    TimeAgoNumberPipe,
    TimeAgoUnitPipe,
    TimeDiffHrs,
    PvcExpiry
  ],
  imports: [],
  exports: [TimeAgoNumberPipe, TimeAgoUnitPipe, TimeDiffHrs, PvcExpiry]
})
export class PipesModule { }
