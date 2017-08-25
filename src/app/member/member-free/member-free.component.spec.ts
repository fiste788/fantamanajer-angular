import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberFreeComponent } from './member-free.component';

describe('MemberFreeComponent', () => {
  let component: MemberFreeComponent;
  let fixture: ComponentFixture<MemberFreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberFreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
