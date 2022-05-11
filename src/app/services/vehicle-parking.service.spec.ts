import { TestBed } from '@angular/core/testing';

import { VehicleParkingService } from './vehicle-parking.service';

describe('VehicleParkingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VehicleParkingService = TestBed.get(VehicleParkingService);
    expect(service).toBeTruthy();
  });
});
