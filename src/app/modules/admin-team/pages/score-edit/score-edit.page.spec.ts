import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreEditPage } from './score-edit.page';

describe('ScoreEditPage', () => {
  let component: ScoreEditPage;
  let fixture: ComponentFixture<ScoreEditPage>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [ScoreEditPage]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
