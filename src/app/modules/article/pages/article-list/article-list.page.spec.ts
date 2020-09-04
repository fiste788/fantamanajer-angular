import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArticleListPage } from './article-list.page';

describe('ArticleListPage', () => {
  let component: ArticleListPage;
  let fixture: ComponentFixture<ArticleListPage>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [ArticleListPage],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component)
      .toBeTruthy();
  });
});
