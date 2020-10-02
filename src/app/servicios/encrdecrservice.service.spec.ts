import { TestBed } from '@angular/core/testing';

import { EncrDecrServiceService } from './encrdecrservice.service';

describe('EncrDecrServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncrDecrServiceService = TestBed.get(EncrDecrServiceService);
    expect(service).toBeTruthy();
  });
});
