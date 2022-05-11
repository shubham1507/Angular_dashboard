import { TestBed } from '@angular/core/testing';

import { StaffManagementService } from './staff-management.service';

describe('StaffManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StaffManagementService = TestBed.get(StaffManagementService);
    expect(service).toBeTruthy();
  });
});
