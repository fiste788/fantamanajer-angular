import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleAreaComponent } from './module-area.component';

describe('ModuleAreaComponent', () => {
  let component: ModuleAreaComponent;
  let fixture: ComponentFixture<ModuleAreaComponent>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [ModuleAreaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
