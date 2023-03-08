import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransfertListPage } from './transfert-list.page';

describe('TransfertListPage', () => {
  let component: TransfertListPage;
  let fixture: ComponentFixture<TransfertListPage>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [TransfertListPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfertListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component).toBeTruthy();
  });
});
