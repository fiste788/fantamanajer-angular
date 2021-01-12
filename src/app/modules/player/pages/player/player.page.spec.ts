import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerPage } from './player.page';

describe('PlayerPage', () => {
  let component: PlayerPage;
  let fixture: ComponentFixture<PlayerPage>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [PlayerPage],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component).toBeTruthy();
  });
});
