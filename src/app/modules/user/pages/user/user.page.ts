import { trigger } from '@angular/animations';
import { Component } from '@angular/core';

import { Tab } from '@data/types';
import { routerTransition } from '@shared/animations';
import { ToolbarTabComponent } from '@shared/components/toolbar-tab/toolbar-tab.component';

@Component({
  animations: [trigger('contextChange', routerTransition)],
  templateUrl: './user.page.html',
  imports: [ToolbarTabComponent],
})
export class UserPage {
  protected readonly tabs: Array<Tab> = [
    { label: 'Profilo', link: 'profile' },
    { label: 'Passkey', link: 'passkeys' },
    { label: 'Attività', link: 'stream' },
  ];
}
