import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineupOptionsComponent } from './lineup-options.component';

describe('LineupOptionsComponent', () => {
  let component: LineupOptionsComponent;
  let fixture: ComponentFixture<LineupOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineupOptionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineupOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
