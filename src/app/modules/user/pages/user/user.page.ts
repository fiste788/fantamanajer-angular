import { trigger } from '@angular/animations';
import { Component } from '@angular/core';

import { routerTransition } from '@shared/animations';
import { ITab } from '@shared/models';

@Component({
  animations: [
    trigger('contextChange', routerTransition),
  ],
  styleUrls: ['./user.page.scss'],
  templateUrl: './user.page.html',
})
export class UserPage {

  public tabs: Array<ITab> = [
    { label: 'Profilo', link: 'profile' },
    { label: 'Attività', link: 'stream' },
  ];

  public track(_: number, item: ITab): string {
    return item.link;
  }

}
