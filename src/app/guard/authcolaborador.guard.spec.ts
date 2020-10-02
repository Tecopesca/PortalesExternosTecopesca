import { TestBed, async, inject } from '@angular/core/testing';

import { AuthcolaboradorGuard } from './authcolaborador.guard';

describe('AuthcolaboradorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthcolaboradorGuard]
    });
  });

  it('should ...', inject([AuthcolaboradorGuard], (guard: AuthcolaboradorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
