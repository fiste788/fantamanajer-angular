import { inject, TestBed } from '@angular/core/testing';

import { ClubService } from './club.service';

describe('ClubService', () => {
  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [ClubService]
    });
  });

  it('should be created', inject([ClubService], (service: ClubService) => {
    void expect(service)
      .toBeTruthy();
  }));
});
