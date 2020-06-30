import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamStreamPage } from './team-stream.page';

describe('TeamStreamPage', () => {
  let component: TeamStreamPage;
  let fixture: ComponentFixture<TeamStreamPage>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [TeamStreamPage],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamStreamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
