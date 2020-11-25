import { trigger } from '@angular/animations';
import { Component } from '@angular/core';

import { routerTransition } from '@shared/animations';
import { Tab } from '@data/types';

@Component({
  animations: [
    trigger('contextChange', routerTransition),
  ],
  styleUrls: ['./user.page.scss'],
  templateUrl: './user.page.html',
})
export class UserPage {

  public tabs: Array<Tab> = [
    { label: 'Profilo', link: 'profile' },
    { label: 'Dispositivi', link: 'devices' },
    { label: 'Attività', link: 'stream' },
  ];

  public track(_: number, item: Tab): string {
    return item.link;
  }

}
