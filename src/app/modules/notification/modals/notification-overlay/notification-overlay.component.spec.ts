import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationOverlayComponent } from './notification-overlay.component';

describe('NotificationOverlayComponent', () => {
  let component: NotificationOverlayComponent;
  let fixture: ComponentFixture<NotificationOverlayComponent>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [NotificationOverlayComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
