import { trigger } from '@angular/animations';
import { Component } from '@angular/core';

import { routerTransition } from '@shared/animations';
import { Tab } from '@shared/models';

@Component({
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  animations: [
    trigger('contextChange', routerTransition)
  ]
})
export class UserPage {

  tabs: Array<{ label: string, link: string }> = [
    { label: 'Profilo', link: 'profile' },
    { label: 'Attività', link: 'stream' }
  ];

  track(_: number, item: Tab): string {
    return item.link;
  }

}
