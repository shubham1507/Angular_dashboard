import { TestBed } from '@angular/core/testing';

import { CabTrackingService } from './cab-tracking.service';

describe('CabTrackingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CabTrackingService = TestBed.get(CabTrackingService);
    expect(service).toBeTruthy();
  });
});
