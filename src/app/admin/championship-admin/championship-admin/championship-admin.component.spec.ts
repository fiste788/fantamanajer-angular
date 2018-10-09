import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionshipAdminComponent } from './championship-admin.component';

describe('ChampionshipAdminComponent', () => {
  let component: ChampionshipAdminComponent;
  let fixture: ComponentFixture<ChampionshipAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChampionshipAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionshipAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
