import { TestBed, async, inject } from '@angular/core/testing';

import { SeguGuard } from './segu.guard';

describe('SeguGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeguGuard]
    });
  });

  it('should ...', inject([SeguGuard], (guard: SeguGuard) => {
    expect(guard).toBeTruthy();
  }));
});
