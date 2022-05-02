import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParallaxHeaderComponent } from './parallax-header.component';

describe('ParallaxHeaderComponent', () => {
  let component: ParallaxHeaderComponent;
  let fixture: ComponentFixture<ParallaxHeaderComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [ParallaxHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParallaxHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component).toBeTruthy();
  });
});
