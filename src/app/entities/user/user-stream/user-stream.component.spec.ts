import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStreamComponent } from './user-stream.component';

describe('UserStreamComponent', () => {
  let component: UserStreamComponent;
  let fixture: ComponentFixture<UserStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
