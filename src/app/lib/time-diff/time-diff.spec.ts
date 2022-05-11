import { TimeDiff } from './time-diff';

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

describe('TimeDiff.getTimeAgo', () => {
  describe('When time range is within minutes', () => {
    it('should return "Now" for difference less than equal to 10 mins ', () => {
      const createdAt = '2019-02-25T12:00:00.000Z';
      const currentTime = '2019-02-25T12:10:59.000Z';
      const timeDiff = new TimeDiff(createdAt, currentTime);
      expect(timeDiff.getMinutes()).toBeLessThanOrEqual(10);
      expect(timeDiff.getTimeAgo().timeUnit).toBe(TIME_UNIT.NOW);
    });

    it('left bound: should return "x mins" for time range from 10 mins to 60 mins', () => {
      const createdAt = '2019-02-25T12:00:00.000Z';
      const currentTime = '2019-02-25T12:11:00.000Z';
      const timeDiff = new TimeDiff(createdAt, currentTime);
      expect(timeDiff.getMinutes()).toBe(11);
      expect(timeDiff.getTimeAgo().timeUnit).toBe(TIME_UNIT.MINS);
    });

    it('right bound: should return "x mins" for time range from 10 mins to 60 mins', () => {
      const createdAt = '2019-02-25T12:00:00.000Z';
      const currentTime = '2019-02-25T13:00:00.000Z';
      const timeDiff = new TimeDiff(createdAt, currentTime);
      expect(timeDiff.getMinutes()).toBe(60);
      expect(timeDiff.getTimeAgo().timeUnit).toBe(TIME_UNIT.MINS);
    });
  });

  describe('When time range is within hours', () => {
    it('should return "1 hour" for time range from 60 mins to 120 mins', () => {
      const createdAt = '2019-02-25T12:00:00.000Z';
      const currentTime = '2019-02-25T13:01:00.000Z';
      const timeDiff = new TimeDiff(createdAt, currentTime);
      expect(timeDiff.getHours()).toBe(1);
      expect(timeDiff.getTimeAgo().timeUnit).toBe(TIME_UNIT.HOUR);
    });

    it('left bound: should return "x hours" for time range from 2 hours to 24 hours', () => {
      const createdAt = '2019-02-25T12:00:00.000Z';
      const currentTime = '2019-02-25T14:00:00.000Z';
      const timeDiff = new TimeDiff(createdAt, currentTime);
      expect(timeDiff.getHours()).toBe(2);
      expect(timeDiff.getTimeAgo().timeUnit).toBe(TIME_UNIT.HOURS);
    });

    it('right bound: should return "x hours" for time range from 2 hours to 24 hours', () => {
      const createdAt = '2019-02-25T12:00:00.000Z';
      const currentTime = '2019-02-26T12:59:59.000Z';
      const timeDiff = new TimeDiff(createdAt, currentTime);
      expect(timeDiff.getHours()).toBe(24);
      expect(timeDiff.getTimeAgo().timeUnit).toBe(TIME_UNIT.HOURS);
    });
  });

  describe('When time range is within days', () => {
    it('should return "1 day" for time range from 24 hours to 48 hours', () => {
      const createdAt = '2019-02-25T12:00:00.000Z';
      const currentTime = '2019-02-26T13:00:00.000Z';
      const timeDiff = new TimeDiff(createdAt, currentTime);
      expect(timeDiff.getDays()).toBe(1);
      expect(timeDiff.getTimeAgo().timeUnit).toBe(TIME_UNIT.DAY);
    });

    it('left bound: should return "x days" for time range from 2 days to 7 days', () => {
      const createdAt = '2019-02-25T12:00:00.000Z';
      const currentTime = '2019-02-27T12:00:00.000Z';
      const timeDiff = new TimeDiff(createdAt, currentTime);
      expect(timeDiff.getDays()).toBe(2);
      expect(timeDiff.getTimeAgo().timeUnit).toBe(TIME_UNIT.DAYS);
    });

    it('right bound: should return "x days" for time range from 2 days to 7 days', () => {
      const createdAt = '2019-02-25T12:00:00.000Z';
      const currentTime = '2019-03-04T12:00:00.000Z';
      const timeDiff = new TimeDiff(createdAt, currentTime);
      expect(timeDiff.getDays()).toBe(7);
      expect(timeDiff.getTimeAgo().timeUnit).toBe(TIME_UNIT.DAYS);
    });
  });

  describe('When time range is within weeks', () => {
    it('should return "1 week" for time range from 7 days to 14 days', () => {
      const createdAt = '2019-02-25T12:00:00.000Z';
      const currentTime = '2019-03-05T12:00:01.000Z';
      const timeDiff = new TimeDiff(createdAt, currentTime);
      expect(timeDiff.getWeeks()).toBe(1);
      expect(timeDiff.getTimeAgo().timeUnit).toBe(TIME_UNIT.WEEK);
    });

    it('left bound: should return "x weeks" for time range from 2 weeks and above', () => {
      const createdAt = '2019-02-25T12:00:00.000Z';
      const currentTime = '2019-03-11T12:00:01.000Z';
      const timeDiff = new TimeDiff(createdAt, currentTime);
      expect(timeDiff.getWeeks()).toBe(2);
      expect(timeDiff.getTimeAgo().timeUnit).toBe(TIME_UNIT.WEEKS);
    });

    it('right bound: should return "x weeks" for time range from 2 weeks and above', () => {
      const createdAt = '2019-02-25T12:00:00.000Z';
      const currentTime = '2020-02-25T12:00:00.000Z';
      const timeDiff = new TimeDiff(createdAt, currentTime);
      expect(timeDiff.getWeeks()).toBe(52);
      expect(timeDiff.getTimeAgo().timeUnit).toBe(TIME_UNIT.WEEKS);
    });
  });
});
