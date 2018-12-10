import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamStreamComponent } from './team-stream.component';

describe('TeamEventsComponent', () => {
  let component: TeamStreamComponent;
  let fixture: ComponentFixture<TeamStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeamStreamComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
