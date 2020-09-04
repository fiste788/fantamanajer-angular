import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChampionshipDetailPage } from './championship-detail.page';

describe('ChampionshipDetailPage', () => {
  let component: ChampionshipDetailPage;
  let fixture: ComponentFixture<ChampionshipDetailPage>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [ChampionshipDetailPage],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionshipDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
