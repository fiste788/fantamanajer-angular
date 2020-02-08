import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionshipDetailComponent } from './championship-detail.component';

describe('ChampionshipDetailComponent', () => {
  let component: ChampionshipDetailComponent;
  let fixture: ComponentFixture<ChampionshipDetailComponent>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [ChampionshipDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionshipDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
