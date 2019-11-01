import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreEditComponent } from './score-edit.component';

describe('ScoreEditComponent', () => {
  let component: ScoreEditComponent;
  let fixture: ComponentFixture<ScoreEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});