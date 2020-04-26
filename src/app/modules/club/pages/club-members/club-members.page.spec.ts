import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubMembersPage } from './club-members.page';

describe('ClubMembersPage', () => {
  let component: ClubMembersPage;
  let fixture: ComponentFixture<ClubMembersPage>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [ClubMembersPage]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
