import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubStreamPage } from './club-stream.page';

describe('ClubStreamPage', () => {
  let component: ClubStreamPage;
  let fixture: ComponentFixture<ClubStreamPage>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [ClubStreamPage],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubStreamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
