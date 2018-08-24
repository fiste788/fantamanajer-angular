import { TestBed, inject } from '@angular/core/testing';

import { NotificationOverlayService } from './notification-overlay.service';

describe('NotificationOverlayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationOverlayService]
    });
  });

  it('should be created', inject([NotificationOverlayService], (service: NotificationOverlayService) => {
    expect(service).toBeTruthy();
  }));
});
