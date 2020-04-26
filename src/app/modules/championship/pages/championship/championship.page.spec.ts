import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionshipPage } from './championship.page';

describe('ChampionshipPage', () => {
  let component: ChampionshipPage;
  let fixture: ComponentFixture<ChampionshipPage>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [ChampionshipPage]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionshipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component)
      .toBeTruthy();
  });
});
