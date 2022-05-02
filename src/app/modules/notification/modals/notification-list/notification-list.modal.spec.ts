import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationListModal } from './notification-list.modal';

describe('NotificationListModal', () => {
  let component: NotificationListModal;
  let fixture: ComponentFixture<NotificationListModal>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [NotificationListModal],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationListModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
