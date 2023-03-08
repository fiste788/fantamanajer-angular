import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamDetailPage } from './team-detail.page';

describe('TeamDetailPage', () => {
  let component: TeamDetailPage;
  let fixture: ComponentFixture<TeamDetailPage>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [TeamDetailPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component).toBeTruthy();
  });
});
