import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineupLastPage } from './lineup-last.page';

describe('LineupLastPage', () => {
  let component: LineupLastPage;
  let fixture: ComponentFixture<LineupLastPage>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [LineupLastPage]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineupLastPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component)
      .toBeTruthy();
  });
});
