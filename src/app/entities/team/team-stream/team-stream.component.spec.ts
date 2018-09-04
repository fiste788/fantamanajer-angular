import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEventsComponent } from './team-events.component';

describe('TeamEventsComponent', () => {
  let component: TeamEventsComponent;
  let fixture: ComponentFixture<TeamEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
