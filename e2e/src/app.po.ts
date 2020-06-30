import { browser, by, element } from 'protractor';

export class FantamanajerAngularPage {
  public async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  public async getTitleText(): Promise<string> {
    return element(by.css('app-root .content span'))
      .getText() as Promise<string>;
  }
}
