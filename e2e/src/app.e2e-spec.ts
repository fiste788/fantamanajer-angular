import { FantamanajerAngularPage } from './app.po';

describe('fantamanajer-angular App', () => {
  let page: FantamanajerAngularPage;

  beforeEach(() => {
    page = new FantamanajerAngularPage();
  });

  it('should display message saying app works', () => {
    void page.navigateTo();
    void expect(page.getParagraphText())
      .toBeDefined('app works!');
  });
});
