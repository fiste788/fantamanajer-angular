import { inject, TestBed } from '@angular/core/testing';

import { UtilService } from './util.service';

describe('UtilService', () => {
  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [UtilService]
    });
  });

  it('should be created', inject([UtilService], (service: UtilService) => {
    void expect(service)
      .toBeTruthy();
  }));
});
