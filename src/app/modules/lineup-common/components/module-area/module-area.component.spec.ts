import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModuleAreaComponent } from './module-area.component';

describe('ModuleAreaComponent', () => {
  let component: ModuleAreaComponent;
  let fixture: ComponentFixture<ModuleAreaComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [ModuleAreaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
