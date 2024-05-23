import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { ClubService } from './club.service';

describe('ClubService', () => {
  beforeEach(() => {
    void TestBed.configureTestingModule({
      imports: [],
      providers: [
        ClubService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should be created', inject([ClubService], (service: ClubService) => {
    void expect(service).toBeTruthy();
  }));
});
