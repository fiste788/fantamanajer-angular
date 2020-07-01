import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertListPage } from './transfert-list.page';

describe('TransfertListPage', () => {
  let component: TransfertListPage;
  let fixture: ComponentFixture<TransfertListPage>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [TransfertListPage],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfertListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component)
      .toBeTruthy();
  });
});