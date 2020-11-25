import { inject, TestBed } from '@angular/core/testing';

import { PlayerService } from './player.service';

describe('PlayerService', () => {
  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [PlayerService],
    });
  });

  it('should be created', inject([PlayerService], (service: PlayerService) => {
    void expect(service)
      .toBeTruthy();
  }));
});
