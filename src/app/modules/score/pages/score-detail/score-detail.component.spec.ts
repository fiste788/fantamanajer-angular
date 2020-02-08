import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreDetailComponent } from './score-detail.component';

describe('ScoreDetailComponent', () => {
  let component: ScoreDetailComponent;
  let fixture: ComponentFixture<ScoreDetailComponent>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [ScoreDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component)
      .toBeTruthy();
  });
});
