import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineupDetailComponent } from './lineup-detail.component';

describe('LineupDetailComponent', () => {
  let component: LineupDetailComponent;
  let fixture: ComponentFixture<LineupDetailComponent>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [LineupDetailComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component)
      .toBeTruthy();
  });
});
