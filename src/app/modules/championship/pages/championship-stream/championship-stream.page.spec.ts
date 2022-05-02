import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChampionshipStreamPage } from './championship-stream.page';

describe('ChampionshipStreamPage', () => {
  let component: ChampionshipStreamPage;
  let fixture: ComponentFixture<ChampionshipStreamPage>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [ChampionshipStreamPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionshipStreamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
