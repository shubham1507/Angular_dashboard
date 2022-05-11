const TIME_UNIT = {
  NOW: 'now',
  MIN: 'min',
  MINS: 'mins',
  HOUR: 'hour',
  HOURS: 'hours',
  DAY: 'day',
  DAYS: 'days',
  WEEK: 'week',
  WEEKS: 'weeks'
};

/**
 * @whatItDoes Calculate difference between timestamps and return the diff in various time units
 * @description
 * `TimeDiff` accepts ISO Date strings and provides diff in various time units
 * if just one parameter is passed it calc diff with Date.now()
 */
export class TimeDiff {
  private _absDiff;
  private _minutes;
  private _hours;
  private _days;
  private _weeks;

  constructor(a, b: number | string = Date.now()) {
    a = Date.parse(a);
    if (typeof b === 'string') {
      b = Date.parse(b);
    }
    this._calcDiff(a, b);
  }

  private _calcDiff = (previous, current) => {
    this._absDiff = Math.floor(current - previous);
    this._minutes = Math.floor(this._absDiff / (1000 * 60));
    this._hours = Math.floor(this._absDiff / (1000 * 60 * 60));
    this._days = Math.floor(this._absDiff / (1000 * 60 * 60 * 24));
    this._weeks = Math.floor(this._absDiff / (1000 * 60 * 60 * 24 * 7));
  }

  public getMinutes = () => {
    return this._minutes;
  }

  public getHours = () => {
    return this._hours;
  }

  public getDays = () => {
    return this._days;
  }

  public getWeeks = () => {
    return this._weeks;
  }

  public getTimeAgo = () => {
    if (this.getMinutes() <= 10) {
      return {
        time: '',
        timeUnit: TIME_UNIT.NOW
      };
    }
    if (this.getMinutes() > 10 && this.getMinutes() <= 60) {
      return {
        time: this.getMinutes(),
        timeUnit: TIME_UNIT.MINS
      };
    }
    if (this.getHours() === 1) {
      return {
        time: this.getHours(),
        timeUnit: TIME_UNIT.HOUR
      };
    }
    if (this.getHours() >= 1 && this.getHours() < 24) {
      return {
        time: this.getHours(),
        timeUnit: TIME_UNIT.HOURS
      };
    }
    if (this.getDays() === 1) {
      return {
        time: this.getDays(),
        timeUnit: TIME_UNIT.DAY
      };
    }
    if (this.getDays() >= 1 && this.getDays() <= 7) {
      return {
        time: this.getDays(),
        timeUnit: TIME_UNIT.DAYS
      };
    }
    if (this.getWeeks() === 1) {
      return {
        time: this.getWeeks(),
        timeUnit: TIME_UNIT.WEEK
      };
    }
    if (this.getWeeks() >= 1) {
      return {
        time: this.getWeeks(),
        timeUnit: TIME_UNIT.WEEKS
      };
    }
  }
}
