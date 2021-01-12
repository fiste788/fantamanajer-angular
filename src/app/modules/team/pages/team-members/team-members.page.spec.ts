import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamMembersPage } from './team-members.page';

describe('TeamMembersPage', () => {
  let component: TeamMembersPage;
  let fixture: ComponentFixture<TeamMembersPage>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [TeamMembersPage],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component).toBeTruthy();
  });
});
