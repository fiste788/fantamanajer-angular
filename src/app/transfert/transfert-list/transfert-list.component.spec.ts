import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertListComponent } from './transfert-list.component';

describe('TransfertListComponent', () => {
  let component: TransfertListComponent;
  let fixture: ComponentFixture<TransfertListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfertListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfertListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
