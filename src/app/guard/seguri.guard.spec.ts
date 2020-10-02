import { TestBed, async, inject } from '@angular/core/testing';

import { SeguriGuard } from './seguri.guard';

describe('SeguriGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeguriGuard]
    });
  });

  it('should ...', inject([SeguriGuard], (guard: SeguriGuard) => {
    expect(guard).toBeTruthy();
  }));
});
