import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditDialogComponent } from './team-edit-dialog.component';

describe('TeamEditDialogComponent', () => {
  let component: TeamEditDialogComponent;
  let fixture: ComponentFixture<TeamEditDialogComponent>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [TeamEditDialogComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
