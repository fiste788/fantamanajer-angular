import { inject, TestBed } from '@angular/core/testing';

import { PushService } from './push.service';

describe('PushService', () => {
  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [PushService]
    });
  });

  it('should be created', inject([PushService], (service: PushService) => {
    void expect(service)
      .toBeTruthy();
  }));
});
