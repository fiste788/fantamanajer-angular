import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserStreamPage } from './user-stream.page';

describe('UserStreamPage', () => {
  let component: UserStreamPage;
  let fixture: ComponentFixture<UserStreamPage>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [UserStreamPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStreamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
