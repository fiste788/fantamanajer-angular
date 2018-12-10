import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionshipStreamComponent } from './championship-stream.component';

describe('TeamEventsComponent', () => {
  let component: ChampionshipStreamComponent;
  let fixture: ComponentFixture<ChampionshipStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChampionshipStreamComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionshipStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
