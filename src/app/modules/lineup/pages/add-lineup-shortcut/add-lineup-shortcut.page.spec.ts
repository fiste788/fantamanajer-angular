import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLineupShortcutPage } from './add-lineup-shortcut.page';

describe('AddLineupShortcutPage', () => {
  let component: AddLineupShortcutPage;
  let fixture: ComponentFixture<AddLineupShortcutPage>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [AddLineupShortcutPage],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLineupShortcutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
