import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewTransfertPage } from './new-transfert.page';

describe('NewTransfertPage', () => {
  let component: NewTransfertPage;
  let fixture: ComponentFixture<NewTransfertPage>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [NewTransfertPage],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTransfertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
