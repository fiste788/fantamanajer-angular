import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamComponent } from './stream.component';

describe('EventListComponent', () => {
  let component: StreamComponent;
  let fixture: ComponentFixture<StreamComponent>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [StreamComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component)
      .toBeTruthy();
  });
});
