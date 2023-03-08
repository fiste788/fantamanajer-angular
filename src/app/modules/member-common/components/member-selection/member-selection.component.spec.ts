import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MemberSelectionComponent } from './member-selection.component';

describe('MemberSelectionComponent', () => {
  let component: MemberSelectionComponent;
  let fixture: ComponentFixture<MemberSelectionComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [MemberSelectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
