import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationSubscriptionComponent } from './notification-subscription.component';

describe('EmailNotificationSubscriptionComponent', () => {
  let component: NotificationSubscriptionComponent;
  let fixture: ComponentFixture<NotificationSubscriptionComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [NotificationSubscriptionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
