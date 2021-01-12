import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerImageComponent } from './player-image.component';

describe('PlayerImageComponent', () => {
  let component: PlayerImageComponent;
  let fixture: ComponentFixture<PlayerImageComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [PlayerImageComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
