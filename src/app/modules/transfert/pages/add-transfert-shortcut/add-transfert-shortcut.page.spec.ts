import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTransfertShortcutPage } from './add-transfert-shortcut.page';

describe('AddTransfertShortcutPage', () => {
  let component: AddTransfertShortcutPage;
  let fixture: ComponentFixture<AddTransfertShortcutPage>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [AddTransfertShortcutPage],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransfertShortcutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
