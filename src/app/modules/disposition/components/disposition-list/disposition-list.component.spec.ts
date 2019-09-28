import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispositionListComponent } from './disposition-list.component';

describe('DispositionListComponent', () => {
  let component: DispositionListComponent;
  let fixture: ComponentFixture<DispositionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispositionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispositionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
