import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubListPage } from './club-list.page';

describe('ClubListPage', () => {
  let component: ClubListPage;
  let fixture: ComponentFixture<ClubListPage>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [ClubListPage]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component)
      .toBeTruthy();
  });
});
