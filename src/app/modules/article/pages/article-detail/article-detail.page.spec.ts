import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDetailPage } from './article-detail.page';

describe('ArticleDetailPage', () => {
  let component: ArticleDetailPage;
  let fixture: ComponentFixture<ArticleDetailPage>;

  beforeEach(async(() => {
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
