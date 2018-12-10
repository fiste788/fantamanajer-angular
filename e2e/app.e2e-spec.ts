import { FantamanajerAngularPage } from './app.po';

describe('fantamanajer-angular App', () => {
  let page: FantamanajerAngularPage;

  beforeEach(() => {
    page = new FantamanajerAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toBeDefined('app works!');
  });
});
