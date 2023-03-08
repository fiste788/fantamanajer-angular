import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LineupDetailComponent } from './lineup-detail.component';

describe('LineupDetailComponent', () => {
  let component: LineupDetailComponent;
  let fixture: ComponentFixture<LineupDetailComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [LineupDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component).toBeTruthy();
  });
});
