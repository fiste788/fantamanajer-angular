import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMembersPage } from './edit-members.page';

describe('EditMembersPage', () => {
  let component: EditMembersPage;
  let fixture: ComponentFixture<EditMembersPage>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [EditMembersPage],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
