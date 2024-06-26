import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MemberFreePage } from './member-free.page';

describe('MemberFreePage', () => {
  let component: MemberFreePage;
  let fixture: ComponentFixture<MemberFreePage>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [MemberFreePage],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberFreePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    void expect(component).toBeTruthy();
  });
});
