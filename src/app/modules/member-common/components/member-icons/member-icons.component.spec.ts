import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MemberIconsComponent } from './member-icons.component';

describe('MemberOptionComponent', () => {
  let component: MemberIconsComponent;
  let fixture: ComponentFixture<MemberIconsComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [MemberIconsComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
