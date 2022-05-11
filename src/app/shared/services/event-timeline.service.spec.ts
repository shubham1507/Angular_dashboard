import { TestBed } from '@angular/core/testing';

import { EventTimelineService } from './event-timeline.service';

describe('EventTimelineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventTimelineService = TestBed.get(EventTimelineService);
    expect(service).toBeTruthy();
  });
});
