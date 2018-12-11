import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatEmptyStateComponent } from './mat-empty-state.component';

describe('MatEmptyStateComponent', () => {
  let component: MatEmptyStateComponent;
  let fixture: ComponentFixture<MatEmptyStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatEmptyStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
