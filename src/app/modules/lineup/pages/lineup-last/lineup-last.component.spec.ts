import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineupLastComponent } from './lineup-last.component';

describe('LineupLastComponent', () => {
  let component: LineupLastComponent;
  let fixture: ComponentFixture<LineupLastComponent>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [LineupLastComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineupLastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component)
      .toBeTruthy();
  });
});
