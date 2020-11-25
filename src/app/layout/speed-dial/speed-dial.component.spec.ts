import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpeedDialComponent } from './speed-dial.component';

describe('SpeedDialComponent', () => {
  let component: SpeedDialComponent;
  let fixture: ComponentFixture<SpeedDialComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [SpeedDialComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedDialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
