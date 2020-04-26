import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubDetailPage } from './club-detail.page';

describe('ClubDetailPage', () => {
  let component: ClubDetailPage;
  let fixture: ComponentFixture<ClubDetailPage>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [ClubDetailPage]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component)
      .toBeTruthy();
  });
});
