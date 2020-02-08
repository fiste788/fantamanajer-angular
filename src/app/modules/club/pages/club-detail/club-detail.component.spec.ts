import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubDetailComponent } from './club-detail.component';

describe('ClubDetailComponent', () => {
  let component: ClubDetailComponent;
  let fixture: ComponentFixture<ClubDetailComponent>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [ClubDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component)
      .toBeTruthy();
  });
});
