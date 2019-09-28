import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubStreamComponent } from './club-stream.component';

describe('ClubStreamComponent', () => {
  let component: ClubStreamComponent;
  let fixture: ComponentFixture<ClubStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubStreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
