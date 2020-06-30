import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStreamPage } from './user-stream.page';

describe('UserStreamPage', () => {
  let component: UserStreamPage;
  let fixture: ComponentFixture<UserStreamPage>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [UserStreamPage],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStreamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
