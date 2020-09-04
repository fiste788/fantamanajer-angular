import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArticleDetailPage } from './article-detail.page';

describe('ArticleDetailPage', () => {
  let component: ArticleDetailPage;
  let fixture: ComponentFixture<ArticleDetailPage>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [ArticleDetailPage],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
