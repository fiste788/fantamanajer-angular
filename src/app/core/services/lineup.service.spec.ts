import { inject, TestBed } from '@angular/core/testing';

import { LineupService } from './lineup.service';

describe('LineupService', () => {
  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [LineupService]
    });
  });

  it('should be created', inject([LineupService], (service: LineupService) => {
    expect(service)
      .toBeTruthy();
  }));
});
