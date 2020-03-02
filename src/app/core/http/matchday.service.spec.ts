import { inject, TestBed } from '@angular/core/testing';

import { MatchdayService } from './matchday.service';

describe('MatchdayService', () => {
  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [MatchdayService]
    });
  });

  it('should be created', inject([MatchdayService], (service: MatchdayService) => {
    void expect(service)
      .toBeTruthy();
  }));
});
