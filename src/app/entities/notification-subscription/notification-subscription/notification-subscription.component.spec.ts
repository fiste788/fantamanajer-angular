import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailNotificationSubscriptionComponent } from './email-notification-subscription.component';

describe('EmailNotificationSubscriptionComponent', () => {
  let component: EmailNotificationSubscriptionComponent;
  let fixture: ComponentFixture<EmailNotificationSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailNotificationSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailNotificationSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
