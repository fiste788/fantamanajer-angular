import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamListPage } from './team-list.page';

describe('TeamListPage', () => {
  let component: TeamListPage;
  let fixture: ComponentFixture<TeamListPage>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [TeamListPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component).toBeTruthy();
  });
});
