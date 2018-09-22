import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTransfertComponent } from './new-transfert.component';

describe('NewTransfertComponent', () => {
  let component: NewTransfertComponent;
  let fixture: ComponentFixture<NewTransfertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTransfertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
