import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionshipStreamPage } from './championship-stream.page';

describe('ChampionshipStreamPage', () => {
  let component: ChampionshipStreamPage;
  let fixture: ComponentFixture<ChampionshipStreamPage>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [ChampionshipStreamPage],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionshipStreamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
