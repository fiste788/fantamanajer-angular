import { inject, TestBed } from '@angular/core/testing';

import { ScoreService } from './score.service';

describe('ScoreService', () => {
  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [ScoreService],
    });
  });

  it('should be created', inject([ScoreService], (service: ScoreService) => {
    void expect(service).toBeTruthy();
  }));
});
