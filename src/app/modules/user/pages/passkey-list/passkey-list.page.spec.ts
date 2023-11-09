import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasskeyListPage } from './passkey-list.page';

describe('PasskeyListPage', () => {
  let component: PasskeyListPage;
  let fixture: ComponentFixture<PasskeyListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasskeyListPage],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasskeyListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
