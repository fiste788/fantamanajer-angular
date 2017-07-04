import { TestBed, inject } from '@angular/core/testing';

import { MatchdayService } from './matchday.service';

describe('MatchdayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatchdayService]
    });
  });

  it('should be created', inject([MatchdayService], (service: MatchdayService) => {
    expect(service).toBeTruthy();
  }));
});
