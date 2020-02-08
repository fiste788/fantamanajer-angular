import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMembersComponent } from './edit-members.component';

describe('TeamEditComponent', () => {
  let component: EditMembersComponent;
  let fixture: ComponentFixture<EditMembersComponent>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [EditMembersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
