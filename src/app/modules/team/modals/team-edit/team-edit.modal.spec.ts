import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamEditModal } from './team-edit.modal';

describe('TeamEditModal', () => {
  let component: TeamEditModal;
  let fixture: ComponentFixture<TeamEditModal>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [TeamEditModal],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamEditModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
