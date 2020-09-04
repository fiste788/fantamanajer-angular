import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MatEmptyStateComponent } from './mat-empty-state.component';

describe('MatEmptyStateComponent', () => {
  let component: MatEmptyStateComponent;
  let fixture: ComponentFixture<MatEmptyStateComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [MatEmptyStateComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
