import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTeamPage } from './add-team.page';

describe('AddTeamPage', () => {
  let component: AddTeamPage;
  let fixture: ComponentFixture<AddTeamPage>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [AddTeamPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
