import { TestBed } from '@angular/core/testing';

import { MenuSearchService } from './menu-search.service';

describe('MenuSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuSearchService = TestBed.get(MenuSearchService);
    expect(service).toBeTruthy();
  });
});
