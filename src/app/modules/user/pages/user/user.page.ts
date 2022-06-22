import { trigger } from '@angular/animations';
import { Component } from '@angular/core';

import { Tab } from '@data/types';
import { routerTransition } from '@shared/animations';

@Component({
  animations: [trigger('contextChange', routerTransition)],
  styleUrls: ['./user.page.scss'],
  templateUrl: './user.page.html',
})
export class UserPage {
  protected readonly tabs: Array<Tab> = [
    { label: 'Profilo', link: 'profile' },
    { label: 'Dispositivi', link: 'devices' },
    { label: 'Attività', link: 'stream' },
  ];

  protected track(_: number, item: Tab): string {
    return item.link;
  }
}
