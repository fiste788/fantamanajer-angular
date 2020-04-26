import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberFreePage } from './member-free.page';

describe('MemberFreePage', () => {
  let component: MemberFreePage;
  let fixture: ComponentFixture<MemberFreePage>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [MemberFreePage]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberFreePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component)
      .toBeTruthy();
  });
});
